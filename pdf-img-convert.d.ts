declare function convert(
    pdf: string | Uint8Array | Buffer,
    conversion_config?: {
            /** Width of the output image in pixels */
            width?: number;
            /** Height of the output image in pixels */
            height?: number;
            /** A list of page numbers to render (default is all pages) */
            page_numbers?: number[];
            /** Whether to output the image in base64 format */
            base64?: boolean;
            /** Scaling ratio for the PDF page viewport */
            scale?: number;
    }
): Promise<string[] | Uint8Array[]>;

export {convert};
