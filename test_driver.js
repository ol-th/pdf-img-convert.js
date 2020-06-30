var pdf2img = require("./pdf-to-image.js");
var fs = require("fs");

// var output = pdf2img.convert('https://gahp.net/wp-content/uploads/2017/09/sample.pdf')
//
//
// output.then(function(pdfArray) {
//   console.log("saving")
//   for (i = 0; i < pdfArray.length; i++){
//     fs.writeFile("output"+i+".png", pdfArray[i], function (error) {
//       if (error) { console.error("Error: " + error); }
//     }); //writeFile
//   } // for
// });

(async function () {
  pdfArray = await pdf2img.convert('https://gahp.net/wp-content/uploads/2017/09/sample.pdf', {width: 1080, page_numbers: [1]});
  console.log("saving");
  for (i = 0; i < pdfArray.length; i++){
    fs.writeFile("output"+i+".png", pdfArray[i], function (error) {
      if (error) { console.error("Error: " + error); }
    }); //writeFile
  } // for
})();
