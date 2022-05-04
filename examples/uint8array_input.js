var pdf2img = require("../pdf-img-convert.js");
var fs = require("fs");
const fetch = require('node-fetch');

(async function () {

  // Getting a uint8array
  var resp = await fetch('http://www.africau.edu/images/default/sample.pdf');
  pdfData = new Uint8Array(await resp.arrayBuffer());

  // Converting it and saving
  pdfArray = await pdf2img.convert(pdfData);
  console.log("Saving");
  for (i = 0; i < pdfArray.length; i++){
    fs.writeFile("./outputImages/output"+i+".png", pdfArray[i], function (error) {
      if (error) { console.error("Error: " + error); }
    }); //writeFile
  } // for
})();
