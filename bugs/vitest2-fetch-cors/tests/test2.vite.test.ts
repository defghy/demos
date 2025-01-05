import { expect, test, beforeAll, describe, afterAll, beforeEach } from 'vitest'

describe('vitest1Fetch', () => {
  beforeAll(async () => {})
  beforeEach(() => {})

  afterAll(async () => {})

  test.concurrent(`fetch result`, async () => {
    const res = await fetch('https://www.baidu.com')
    const json: any = await res.text()
    expect(json).toBeTypeOf('string')
  })
})
