import fetch from 'node-fetch';
import isURL from 'is-url';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as Canvas from 'canvas';
import assert from 'assert';
import fs from 'fs';
import util from 'util';

// Promisify readFile for file reading
const readFile = util.promisify(fs.readFile);

// Set the full path to the worker
// Crucial for ES6 module-based frameworks such as Next.js
GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';

// Canvas Factory for Node.js
function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function (width, height) {
    assert(width > 0 && height > 0, "Invalid canvas size");
    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas: canvas,
      context: context,
    };
  },

  reset: function (canvasAndContext, width, height) {
    assert(canvasAndContext.canvas, "Canvas is not specified");
    assert(width > 0 && height > 0, "Invalid canvas size");
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function (canvasAndContext) {
    assert(canvasAndContext.canvas, "Canvas is not specified");
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

// Main conversion function
export async function convert(pdf, conversion_config = {}) {
  let pdfData = pdf;

  // Determine the source of the PDF (URL, Base64, file path, etc.)
  if (typeof pdf === 'string') {
    if (isURL(pdf)) {
      const resp = await fetch(pdf);
      pdfData = new Uint8Array(await resp.arrayBuffer());
    } else if (/pdfData:pdf\/([a-zA-Z]*);base64,([^"]*)/.test(pdf)) {
      pdfData = new Uint8Array(Buffer.from(pdf.split(',')[1], 'base64'));
    } else {
      pdfData = new Uint8Array(await readFile(pdf));
    }
  } else if (Buffer.isBuffer(pdf)) {
    pdfData = new Uint8Array(pdf);
  } else if (!(pdf instanceof Uint8Array)) {
    return pdf;
  }

  const outputPages = [];
  const loadingTask = getDocument({ data: pdfData, disableFontFace: true, verbosity: 0 });
  const pdfDocument = await loadingTask.promise;

  const canvasFactory = new NodeCanvasFactory();

  if (conversion_config.height <= 0 || conversion_config.width <= 0) {
    console.error("Negative viewport dimension given. Defaulting to 100% scale.");
  }

  const pageNumbers = conversion_config.page_numbers || Array.from({ length: pdfDocument.numPages }, (_, i) => i + 1);

  // Process pages in parallel
  const pagePromises = pageNumbers.map(pageNo =>
      docRender(pdfDocument, pageNo, canvasFactory, conversion_config)
          .then(currentPage => {
            if (currentPage != null) {
              return conversion_config.base64
                  ? currentPage.toString('base64')
                  : new Uint8Array(currentPage);
            }
          })
  );

  const results = await Promise.all(pagePromises);
  results.forEach(result => {
    if (result) {
      outputPages.push(result);
    }
  });

  return outputPages;
}

// Render PDF pages
async function docRender(pdfDocument, pageNo, canvasFactory, conversion_config) {
  if (pageNo < 1 || pageNo > pdfDocument.numPages) {
    console.error("Invalid page number " + pageNo);
    return;
  }

  if (conversion_config.scale && conversion_config.scale <= 0) {
    console.error("Invalid scale " + conversion_config.scale);
    return;
  }

  const page = await pdfDocument.getPage(pageNo);
  const outputScale = conversion_config.scale || 1.0;
  let viewport = page.getViewport({ scale: outputScale });

  if (conversion_config.width) {
    const scale = conversion_config.width / viewport.width;
    viewport = page.getViewport({ scale });
  } else if (conversion_config.height) {
    const scale = conversion_config.height / viewport.height;
    viewport = page.getViewport({ scale });
  }

  const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
  const renderContext = {
    canvasContext: canvasAndContext.context,
    viewport,
    canvasFactory,
  };

  await page.render(renderContext).promise;
  const image = canvasAndContext.canvas.toBuffer();

  // Properly destroy canvas resources
  canvasFactory.destroy(canvasAndContext);

  return image;
}
