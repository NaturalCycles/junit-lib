export interface TestSuitesAttrs {
  name?: string
  tests?: number
  failures?: number
  errors?: number
  time?: number
  disabled?: number
  [attr: string]: any
}

/**
 * Report with root element of <testsuites> (plural)
 */
export interface JUnitTestSuitesReport {
  testsuites: {
    $?: TestSuitesAttrs
    testsuite: TestSuite[]
  }
}

/**
 * Report with root element of <testsuite> (singular)
 */
export interface JUnitTestSuiteReport {
  testsuite: TestSuite
}

export interface TestSuiteAttrs {
  name?: string
  tests?: number
  failures?: number
  skipped?: number
  errors?: number
  time?: number
  timestamp?: string
  disabled?: number
  [attr: string]: any
}

export interface TestSuite {
  $?: TestSuiteAttrs
  testcase?: TestCase[]
  'system-out'?: string
  'system-err'?: string
}

export interface TestCaseAttrs {
  classname?: string
  name?: string
  time?: number
  assertions?: string
  status?: string
  [attr: string]: any
}

export interface TestCase {
  $: TestCaseAttrs
  skipped?: string[]
  error?: string[]
  failure?: string[]
  'system-out'?: string
  'system-err'?: string
}
