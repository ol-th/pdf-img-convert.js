var pdf2img = require("../pdf-img-convert.js");
var fs = require("fs");

(async function () {
  pdfArray = await pdf2img.convert('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', {width: 1080, base64: true});
  // At this point each index of the array has a base64-encoded image of a page.
  // This accesses page 1
  console.log(pdfArray[0]);
})();
