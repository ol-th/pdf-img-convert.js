declare function convert (
  pdf: string|Uint8Array|Buffer,
  conversion_config?: {
    /** Number in px */
    width?: number
    /** Number in px */
    height?: number
    /** A list of pages to render instead of all of them */
    page_numbers?: number[]
    /** Output as base64 */
    base64?: boolean
    /** Viewport scale as ratio */
    scale?: number
    /** renderContext accepts 'intent' which supports three values: 'display' (default DPI), 'print' (higher DPI) or 'any'. */
    intent?: string
  }
): Promise<string[]|Uint8Array[]>

export {convert}
