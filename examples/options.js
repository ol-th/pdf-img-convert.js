var pdf2img = require("../pdf-img-convert.js");
var fs = require("fs");

(async function () {

  let options = {
    width: 1080, // 1080px width - can use height alternatively
    page_numbers: [1, 2, 4], // Convert pages 1, 2 and 4
    base64: true // Convert to base64 encoded image
  }

  pdfArray = await pdf2img.convert('http://www.africau.edu/images/default/sample.pdf', options);
  console.log("Saving");
  for (i = 0; i < pdfArray.length; i++){
    fs.writeFile("./outputImages/output"+i+".png", pdfArray[i], function (error) {
      if (error) { console.error("Error: " + error); }
    }); //writeFile
  } // for


})();
