# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 2.1.0 - 2024-10-06
### Added
- **New file output formats**: Added support for multiple output formats such as JPEG, PNG, and WebP, rather than just Buffer and Base64.
## 2.0.0 - 2024-09-27
### Added
- **ES6 Module Support**: Switched from `require()` to ES6 `import` for better compatibility with modern JavaScript frameworks.
- **Parallel Page Rendering**: Introduced parallel rendering of PDF pages using `Promise.all()` for improved performance.
- **GlobalWorkerOptions Setup**: Added explicit `GlobalWorkerOptions.workerSrc` to handle workers in ES6 environments more effectively.
- **Examples and Server Setup**: Added detailed examples and a simple Node.js server setup in the "examples" directory.
- **Improved Error Handling**: Added more informative error messages for invalid page numbers, dimensions, and scale values.
- **Updated `package.json` Keywords**: Added new keywords such as `es6`, `esm`, and `module`  to improve discoverability in modern JavaScript environments.

### Changed
- **README**: Revised the `README.md` to reflect new features and usage examples.

### Fixed
- **Security**: Addressed a critical security vulnerability in previously used npm packages by updating `pdfjs-dist` to the latest versions.
- **Scaling Logic**: Refined the handling of `width`, `height`, and `scale` parameters to cover more edge cases in image rendering.

## 1.2.1 - 2023-04-16

## 1.2.0 - 2023-03-05
### Added
- Add scale parameter.

## 1.1.3 - 2023-03-05
### Added
- Add files whitelist to `package.json`.

## 1.1.2 - 2023-03-05

## 1.1.1 - 2022-11-03
### Changed
- Fix return type in `d.ts`

## 1.1.0 - 2022-11-03
### Added
- Changelog

### Changed
- Revert to `disableFontFace: true`

## 1.0.6 - 2021-01-01
### Added
- Underlying project code
