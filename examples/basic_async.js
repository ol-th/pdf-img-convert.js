var pdf2img = require("../pdf-img-convert.js");
var fs = require("fs");

(async function () {
  pdfArray = await pdf2img.convert('https://gahp.net/wp-content/uploads/2017/09/sample.pdf');
  console.log("Saving");
  for (i = 0; i < pdfArray.length; i++){
    fs.writeFile("./outputImages/output"+i+".png", pdfArray[i], function (error) {
      if (error) { console.error("Error: " + error); }
    }); //writeFile
  } // for
})();
