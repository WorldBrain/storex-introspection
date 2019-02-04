const expect = require('expect')
const omit = require('lodash/omit')
import { createTestStorageManager, generateTestObject } from '@worldbrain/storex/lib/index.tests'
import { dissectCreateObjectOperation } from './utils';

describe('Create object operation dissecting', () => {
    it('should correctly dissect a createObject operation with no relationships', async () => {
        const storageManager = await createTestStorageManager({
            configure: () => null
        } as any)

        const testObject = generateTestObject({email: 'foo@test.com', passwordHash: 'notahash', expires: 10})
        delete testObject['emails']
        expect(dissectCreateObjectOperation({
            operation: 'createObject',
            collection: 'user',
            args: testObject
        }, storageManager.registry)).toEqual({
            objects: [
                {
                    placeholder: 1,
                    collection: 'user',
                    object: omit(testObject, 'emails'),
                    relations: {}
                },
            ]
        })
    })

    it('should correctly dissect a createObject operation childOf relationships', async () => {
        const storageManager = await createTestStorageManager({
            configure: () => null
        } as any)

        const testObject = generateTestObject({email: 'foo@test.com', passwordHash: 'notahash', expires: 10})
        delete testObject.emails[0].verificationCode
        expect(dissectCreateObjectOperation({
            operation: 'createObject',
            collection: 'user',
            args: testObject
        }, storageManager.registry)).toEqual({
            objects: [
                {
                    placeholder: 1,
                    collection: 'user',
                    object: omit(testObject, 'emails'),
                    relations: {},
                },
                {
                    placeholder: 2,
                    collection: 'userEmail',
                    object: omit(testObject.emails[0], 'verificationCode'),
                    relations: {
                        user: 1
                    },
                },
            ]
        })
    })

    it('should correctly dissect a createObject operation childOf and singleChildOf relationships', async () => {
        const storageManager = await createTestStorageManager({
            configure: () => null
        } as any)

        const testObject = generateTestObject({email: 'foo@test.com', passwordHash: 'notahash', expires: 10})
        expect(dissectCreateObjectOperation({
            operation: 'createObject',
            collection: 'user',
            args: testObject
        }, storageManager.registry)).toEqual({
            objects: [
                {
                    placeholder: 1,
                    collection: 'user',
                    object: omit(testObject, 'emails'),
                    relations: {},
                },
                {
                    placeholder: 2,
                    collection: 'userEmail',
                    object: omit(testObject.emails[0], 'verificationCode'),
                    relations: {
                        user: 1
                    },
                },
                {
                    placeholder: 3,
                    collection: 'userEmailVerificationCode',
                    object: omit(testObject.emails[0].verificationCode),
                    relations: {
                        userEmail: 2
                    },
                },
            ]
        })
    })
})
