export const SHARED_CREATE_OBJECT_TEST = {
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