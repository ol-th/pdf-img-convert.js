var pdf2img = require("./pdf2img.js");
var fs = require("fs");

pdf2img.convert('https://gahp.net/wp-content/uploads/2017/09/sample.pdf').then(function(pdfArray) {
  console.log("saving")
  for (i = 0; i < pdfArray.length; i++){
    fs.writeFile("output"+i+".png", pdfArray[i], function (error) {
      if (error) { console.error("Error: " + error); }
    }); //writeFile
  } // for
});
