## @naturalcycles/junit-lib

> Convert junit xml to html, merge multiple junit xml reports.

[![npm](https://img.shields.io/npm/v/@naturalcycles/junit-lib/latest.svg)](https://www.npmjs.com/package/@naturalcycles/junit-lib)
[![](https://circleci.com/gh/NaturalCycles/junit-lib.svg?style=shield&circle-token=123)](https://circleci.com/gh/NaturalCycles/junit-lib)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Why

I didn't find a good working library in npm to convert junit xml report to html.

# Examples

```sh

# Convert `report.xml` into `report.html`
junit2html report.xml --out report.html

# Merge all xml files in `report` dir into one html report
junit2html './reports/**/*.xml' --out report.html

```

# API

- `junit2html`

# Packaging

- `engines.node >= 10.13`: Latest Node.js LTS
- `main: dist/index.js`: commonjs, es2018
- `types: dist/index.d.ts`: typescript types
- `/src` folder with source `*.ts` files included

# JUnit xml specification

- https://llg.cubic.org/docs/junit/
- https://stackoverflow.com/a/26661423/4919972
- https://www.ibm.com/support/knowledgecenter/en/SSUFAU_1.0.0/com.ibm.rsar.analysis.codereview.cobol.doc/topics/cac_useresults_junit.html
