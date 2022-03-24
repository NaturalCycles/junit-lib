/*

yarn tsn debug.script.ts

 */

import * as fs from 'fs'
import { inspectAny, runScript } from '@naturalcycles/nodejs-lib'
import { xmlToReport } from '../src/junit.util'
import { tmpDir } from './paths'

runScript(async () => {
  const xml = fs.readFileSync(`${tmpDir}/integration.xml`, 'utf8')

  const r = await xmlToReport(xml)
  console.log(inspectAny(r))
})
