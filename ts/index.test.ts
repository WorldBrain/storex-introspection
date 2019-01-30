import * as expect from 'expect'
import { StorageOperationIntrospection } from '.'

describe('Operation introspection', () => {
    it('should be able to do custom introspections', () => {
        const calls = []
        const introspection = new StorageOperationIntrospection()
        introspection.registerInspector('myOperation', (args) => {
            calls.push({args})
            return 'something' as any
        })
        expect(introspection.inspect({
            operation: 'myOperation',
            eggs: 'spam'
        })).toEqual('something')
        expect(calls).toEqual([{args: {
            operationDefinition: {
                operation: 'myOperation',
                eggs: 'spam'
            }
        }}])
    })
})
