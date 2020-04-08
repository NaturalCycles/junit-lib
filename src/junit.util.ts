import { pMap } from '@naturalcycles/js-lib'
import { json2html } from '@naturalcycles/json2html'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import { promisify } from 'util'
import { OptionsV2, parseString as _parseString, processors } from 'xml2js'
import * as yargs from 'yargs'
import { JUnitTestSuiteReport, JUnitTestSuitesReport, TestSuite } from './junit.model'

const parseString = promisify<string, OptionsV2, any>(_parseString)

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

  const xmlFiles = await globby(inputPatterns)
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

  const reports = await pMap(xmlFiles, xmlToReport)
  const report = mergeReports(reports)
  const html = json2html(report.testsuites.testsuite as any)

  // console.log(JSON.stringify(report, null, 2))

  await fs.ensureFile(outPath)
  await fs.writeFile(outPath, html)
  console.log(`junit2html done: ${outPath}`)
}

async function xmlToReport(xmlPath: string): Promise<JUnitTestSuitesReport> {
  const xml = await fs.readFile(xmlPath, 'utf8')
  const js = await parseString(xml, {
    trim: true,
    // explicitArray: true,
    explicitArray: false,
    mergeAttrs: true,
    attrValueProcessors: [processors.parseNumbers, processors.parseBooleans],
  })

  return (js as JUnitTestSuiteReport).testsuite ? testSuitesToReport(js) : js
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
