import { pMap } from '@naturalcycles/js-lib'
import { json2html } from '@naturalcycles/json2html'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import { parseStringPromise as parseString, processors } from 'xml2js'
import * as yargs from 'yargs'
import { JUnitTestSuiteReport, JUnitTestSuitesReport, TestSuite } from './junit.model'

export async function junit2htmlCommand(): Promise<void> {
  const { argv } = yargs.demandCommand(1).options({
    out: {
      type: 'string',
      default: 'report.html',
    },
    debug: {
      type: 'boolean',
    },
  })

  const { _: inputPatterns, out: outPath, debug } = argv
  if (debug) console.log({ argv })

  const xmlFiles = globby.sync(inputPatterns as string[])
  if (debug) console.log({ xmlFiles })

  if (!xmlFiles.length) {
    console.log(`junit2html found 0 files matching input patterns: ${inputPatterns.join(' ')}`)
    process.exit(1)
  }

  if (xmlFiles.length > 1) {
    console.log(`junit2html will merge ${xmlFiles.length} xml files`)
  }

  /*
  const xml = await fs.readFile(xmlFiles[0], 'utf8')
  const reports = await parseString(xml, {
    trim: true,
    explicitArray: false,
    mergeAttrs: true,
    attrValueProcessors: [processors.parseNumbers, processors.parseBooleans],
  })
   */

  const reports = await pMap(xmlFiles, async xmlPath => {
    const xml = fs.readFileSync(xmlPath, 'utf8')
    return await xmlToReport(xml)
  })
  const report = mergeReports(reports)
  const html = json2html(report.testsuites.testsuite as any)

  // console.log(JSON.stringify(report, null, 2))

  fs.ensureFileSync(outPath)
  fs.writeFileSync(outPath, html)
  console.log(`junit2html done: ${outPath}`)
}

export async function xmlToReport(xml: string): Promise<JUnitTestSuitesReport> {
  const js = await parseString(xml, {
    trim: true,
    // explicitArray: true,
    explicitArray: false,
    mergeAttrs: true,
    attrValueProcessors: [processors.parseNumbers, processors.parseBooleans],
  })

  const r: JUnitTestSuitesReport = (js as JUnitTestSuiteReport).testsuite
    ? testSuitesToReport(js)
    : js

  // Filter-out nullish `classname`
  if (Array.isArray(r.testsuites.testsuite)) {
    r.testsuites.testsuite.forEach(ts => {
      ts.testcase?.forEach(tc => {
        if (!tc.classname) delete tc.classname
      })
    })
  } else {
    r.testsuites.testsuite.testcase?.forEach(tc => {
      if (!tc.classname) delete tc.classname
    })
  }

  return r
}

function testSuitesToReport(r: JUnitTestSuiteReport): JUnitTestSuitesReport {
  return {
    testsuites: {
      testsuite: [r.testsuite],
    },
  }
}

function mergeReports(reports: JUnitTestSuitesReport[]): JUnitTestSuitesReport {
  const testSuiteObjects: TestSuite[] = []

  reports.forEach(r => {
    testSuiteObjects.push(
      ...(Array.isArray(r.testsuites.testsuite)
        ? r.testsuites.testsuite
        : [r.testsuites.testsuite]),
    )
    // console.log(Array.isArray(r.testsuites.testsuite))
  })

  return {
    testsuites: {
      testsuite: testSuiteObjects,
    },
  }
}
