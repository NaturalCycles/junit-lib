#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { junit2htmlCommand } from '../junit.util'

runScript(async () => {
  await junit2htmlCommand()
})
