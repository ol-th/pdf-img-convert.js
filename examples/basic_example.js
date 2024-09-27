/*
To test or run this on a local node server, begin by:
Ensuring your terminal is pointing to examples folder as the root directory.
Installing all the necessary libraries in package.json.
Finally, start the node server by typing node basic_example.js
*/

import fs from 'fs';
import * as path from "path";

// These are "optional" config options you can pass to convert
let config = {
    /*
    width: 300, // 300px width - can use height alternatively
    height: 300, // 300px width - can use width alternatively
    scale: 2,  // viewport scale ratio, which defaults to 1 (original width and height)
    base64: true, // Convert to base64 encoded image. false option defaults to unit8Array
    page_numbers: [1, 2] // control rendered pages on the PDF document
    */
    scale: 1,
};

async function processPDF() {
    const pdf2img = await import('./convert.min.js');

    // How to use convert. This returns a promise as an async function
    // PDFs from different sources and with different options
    const outputWithExternalLink = await pdf2img.convert('https://sedl.org/afterschool/toolkits/science/pdf/ast_sci_data_tables_sample.pdf');
    const outputWithLocalSample = await pdf2img.convert('./test_pdfs/sample.pdf');
    const outputWithLocalSampleAndOptions = await pdf2img.convert('./test_pdfs/sample.pdf', config);

// OUTPUT OPTIONS ARRAY
    const outputs = [outputWithExternalLink, outputWithLocalSample, outputWithLocalSampleAndOptions];

// Select the desired output for testing
    const pdfArray = outputs[0]; // Change the index to select different outputs

    /**** default output format ****/
    function saveImages(pdfArray) {
        console.log('Processing images...');
        pdfArray.forEach((image, index) => {
            const outputPath = path.join('./outputImages', `saveImages_${index}.png`);
            fs.writeFile(outputPath, image, (error) => {
                if (error) {
                    console.error(`Error saving image ${index + 1}:`, error);
                } else {
                    console.log(`Image ${index + 1} saved successfully`);
                }
            });
        });
    }

// Call the default saveImages function
    saveImages(pdfArray);
    /**** Base 64 as the chosen output format ****/

    function saveBase64Images(pdfArray) {
        console.log('Processing base64Images...');
        pdfArray.forEach((base64Data, index) => {
            // Convert Base64 string to binary buffer
            const buffer = Buffer.from(base64Data, 'base64');
            // Define an output path
            const outputPath = path.join('./outputImages', `saveBase64Image_${index}.png`);

            // Write the buffer to a PNG file
            fs.writeFile(outputPath, buffer, (error) => {
                if (error) {
                    console.error(`Error saving image ${index + 1} (base64):`, error);
                } else {
                    console.log(`Image ${index + 1} (base64) saved successfully`);
                }
            });
        });
    }

// Call the function saveBase64Images function
    saveBase64Images(pdfArray);
}

// Call the async function
processPDF().then(() => console.log("Process completed successfully")).catch((e) => console.log("Something went wrong:", e));



