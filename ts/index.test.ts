import * as expect from 'expect'
import { StorageOperationInspection } from '.'

describe('Operation inspection', () => {
    it('should be able to do custom inspections', () => {
        const calls = []
        const inspection = new StorageOperationInspection()
        inspection.registerInspector('myOperation', (args) => {
            calls.push({args})
            return 'something' as any
        })
        expect(inspection.inspect({
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

    it('should throw an error if trying to inspect an operation for which no inspector is registered', () => {
        const inspection = new StorageOperationInspection()
        expect(() => inspection.inspect({operation: 'nonExistingFubarStuff'})).toThrow(
            `Don't know how to inspect operation: 'nonExistingFubarStuff'`
        )
    })

    it('should be able to inspect well-known operations', () => {
        const inspection = new StorageOperationInspection()
        expect(inspection.inspect({
            operation: 'createObject',
            collection: 'user',
            args: {
                displayName: 'Joe',
                emails: [
                    {address: 'joe@don.com'}
                ]
            }
        })).toEqual('ooohhhh')
    })
})
