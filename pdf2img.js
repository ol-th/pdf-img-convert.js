/*

Copyright (c) 2020 Ollie Thwaites

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

const fetch = require('node-fetch');
const isURL = require('is-url');
const pdfjs = require('pdfjs-dist/es5/build/pdf.js');
const Canvas = require("canvas");
const assert = require("assert").strict;
const fs = require("fs");

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
    assert(width > 0 && height > 0, "Invalid canvas size");
    var canvas = Canvas.createCanvas(width, height);
    var context = canvas.getContext("2d");
    return {
      canvas: canvas,
      context: context,
    };
  },

  reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
    assert(canvasAndContext.canvas, "Canvas is not specified");
    assert(width > 0 && height > 0, "Invalid canvas size");
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
    assert(canvasAndContext.canvas, "Canvas is not specified");

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

async function convert (pdf) {

// Get the PDF in Uint8Array form

  let pdfData = pdf;

  if (typeof pdf === 'undefined') {
    return pdf;
  }

  if (typeof pdf === 'string') {

    if (isURL(pdf) || pdf.startsWith('moz-extension://') || pdf.startsWith('chrome-extension://') || pdf.startsWith('file://')) {
      const resp = await fetch(pdf);
      pdfData = new Uint8Array(await resp.arrayBuffer());
    }
    else if (/pdfData:pdf\/([a-zA-Z]*);base64,([^"]*)/.test(pdf)) {
      pdfData = new Uint8Array(Buffer.from(pdf.split(',')[1], 'base64'));
    }
    else {
      pdfData = new Uint8Array(fs.readFileSync(pdfURL));
    }
  }
  else if (Buffer.isBuffer(pdf)) {
    pdfData = new Uint8Array(pdf);
  }

  console.log(pdfData);

  // At this point, we want to convert the pdf data into a 2D array representing
  // the images (indexed like array[page][pixel])
  var outputPages = [];
  var loadingTask = pdfjs.getDocument({data: pdfData, disableFontFace:false});

  loadingTask.promise
  .then(function (pdfDocument) {

    console.log("# PDF document loaded.");

    var canvasFactory = new NodeCanvasFactory();
    //Loop over each page in the doc
    for (i = 1; i <= pdfDocument.numPages; i++) {

      // Get the page.
      pdfDocument.getPage(i).then(function (page) {
        // Render the page on a Node canvas with 100% scale.
        // TODO: allow to change the image scale here
        let viewport = page.getViewport({ scale: 1.0 });
        let canvasAndContext = canvasFactory.create(
          viewport.width,
          viewport.height
        );
        let renderContext = {
          canvasContext: canvasAndContext.context,
          viewport: viewport,
          canvasFactory: canvasFactory
        };
        let renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
          // Convert the canvas to an image buffer.
          let image = canvasAndContext.canvas.toBuffer();
          outputPages.push(image);
          fs.writeFile("output"+i+".png", image, function (error) {
            if (error) {
              console.error("Error: " + error);
            } else {
              console.log(
                "Finished converting first page of PDF file to a PNG image."
              );
            }
          });
        });
      });
    }
  })
  .catch(function (reason) {
    console.log(reason);
  });
}


convert('https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf');
