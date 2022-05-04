var pdf2img = require("../pdf-img-convert.js");
var fs = require("fs");

(async function () {
  pdfArray = await pdf2img.convert('http://www.africau.edu/images/default/sample.pdf');
  console.log("Saving");
  for (i = 0; i < pdfArray.length; i++){
    fs.writeFile("./outputImages/output"+i+".png", pdfArray[i], function (error) {
      if (error) { console.error("Error: " + error); }
    }); //writeFile
  } // for
})();
