import { stringify, parse } from 'flatted'
import { stringify as stringify2, parse as parse2 } from '@ungap/structured-clone/json'

parse(stringify({ any: 'serializable' }))

window.flatted = {
  stringify,
  parse,
  test() {
    const arr = [1, 2, 3, 4]
    const data = { a: arr, b: arr }

    console.log(stringify(data))
  },
}

window.ungap = {
  stringify: stringify2,
  parse: parse2,
  test() {
    const arr = [1, 2, 3, 4]
    const data = { a: arr, b: arr }

    console.log(stringify2(data))
  },
}
