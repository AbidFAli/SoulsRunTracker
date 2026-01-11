import { expect, test, describe } from 'vitest'
import { unnullify } from './graphql'


describe('unnullify', () => {
  test('clones the object', () => {
    const objWithArray = {
      first: [null, null, null]
    }

    const clone = unnullify(objWithArray);
    expect(clone.first !== objWithArray.first);
    expect(clone.first.length == 0);
  })
})