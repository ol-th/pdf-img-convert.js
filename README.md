# pdf2img.js
**A pure javascript package to convert a PDF into images**

**This package is powered mainly by Mozilla's [PDF.js](https://github.com/mozilla/pdf.js)**

## Motivation

There are a lot of solutions for converting PDFs with javascript already but they all make excessive use of the filesystem in the form of
temporary files and use non-native binaries like ghostscript.

This solution solely uses javascript arrays, cleaning up the pipeline significantly and (hopefully) making it faster.

## Installation

```bash
npm install pdf2img
```

## Usage

The package returns an `Array` of `Uint8Array` objects, each of which represents an image encoded in png format.

Here are some examples of its usage:

```javascript
var pdf2img = require('pdf2img.js');

// Both HTTP and local paths are supported
var outputImages1 = pdf2img.convert("http://www.example.com/pdf_online.pdf");
var outputImages2 = pdf2img.convert("../pdf_in_local_filesystem.pdf");

// From here, the images can be used for other stuff or just saved if that's required:

var fs = require('fs');

for (i = 0; i < outputImages.length; i++)
    fs.writeFile("output"+i+".png", outputImages[i], function (error) {
      if (error) { console.error("Error: " + error); }
    });
```

There is also an optional conversion_config argument which expects an object like this:

```javascript
{
  width: 100 //Number in px
  height: 100 // Number in px
  page_numbers: [1, 2, 3] // A list of pages to render instead of all of them
}
```

* `width` or `height` control the scale of the document - One or the other, it ignores height if width is supplied too.

* `page_numbers` controls which pages are rendered - pages are 1-indexed.
