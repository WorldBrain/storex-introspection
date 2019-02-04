import * as expect from 'expect'
import { DEFAULT_INSPECTORS } from './inspectors'

const NESTED_CREATE_OBJECT_TEST = {
    input: {
        operation: 'createObject',
        collection: 'user',
        args: {
            displayName: 'Joe',
            emails: [
                {address: 'joe@don.com'}
            ]
        }
    },
    output: 'ooohhhh'
}
export const SHARED_CREATE_OBJECT_TEST = NESTED_CREATE_OBJECT_TEST

function verify({input, output}) {
    expect(DEFAULT_INSPECTORS[input.operation](input)).toEqual(output)
}

describe('Inspectors', () => {
    describe('createObject', () => {
        it('should correctly introspect a createObject operation with a nested object', () => {
            verify(SHARED_CREATE_OBJECT_TEST)
        })
    })
})
