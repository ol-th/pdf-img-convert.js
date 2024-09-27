/*
To test or run this on a local node server, begin by:
Ensuring your terminal is pointing to examples folder as the root directory.
Installing all the necessary libraries in package.json.
Finally, start the node server by typing "node async_example.js"
*/
import fs from 'fs';
import path from 'path';
// These are "optional" config options you can pass to convert
let config = {
    /*
    width: 300 // 300px width - can use height alternatively
    height: 300 // 300px width - can use width alternatively
    scale: 2  // viewport scale ratio, which defaults to 1 (original width and height)
    base64: true // Convert to base64 encoded image, false option defaults to unit8Array
    page_numbers: [1, 2], // control rendered pages on the PDF document
    */
    scale: 1,
    base64: false
};
// Normal IIFE
(async function () {
    try {
        // Dynamically import the pdf2img module
        const pdf2img = await import('./convert.min.js');
        // Convert the PDF file to an array of images
        const pdfArray = await pdf2img.convert('./test_pdfs/sample.pdf', config);
        console.log('Processing images...');
        // Save each image from the pdfArray
        pdfArray.forEach((imageData, index) => {
            const outputPath = path.join('./outputImages', `basic_sample_${index}.png`);
            fs.writeFile(outputPath, imageData, (error) => {
                if (error) {
                    console.error(`Error saving image ${index + 1}:`, error);
                } else {
                    console.log(`Image ${index + 1} saved successfully`);
                }
            });
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();


// Getting a uint8array IIFE
(async function () {
    try {
        // Fetch the PDF
        const response = await fetch('https://sedl.org/afterschool/toolkits/science/pdf/ast_sci_data_tables_sample.pdf');
        const pdfData = new Uint8Array(await response.arrayBuffer());

        // Dynamically import the pdf2img module
        const pdf2img = await import('./convert.min.js');

        // Convert the PDF data to an array of images
        const pdfArray = await pdf2img.convert(pdfData);

        console.log('Processing uint8array images...');

        // Save each image from the pdfArray
        for (let i = 0; i < pdfArray.length; i++) {
            const outputPath = path.join('./outputImages', `uint8_array_${i}.png`);
            await fs.promises.writeFile(outputPath, pdfArray[i]);
            console.log(`Image ${i + 1} saved successfully`);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();