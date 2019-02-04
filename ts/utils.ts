const pickBy = require('lodash/fp/pickBy')
import { StorageRegistry } from '@worldbrain/storex'
import { isConnectsRelationship, isChildOfRelationship, getOtherCollectionOfConnectsRelationship } from '@worldbrain/storex/lib/types'

export function dissectCreateObjectOperation(operationDefinition, registry : StorageRegistry) {
    const objectsByPlaceholder = {}
    let placeholdersCreated = 0

    const dissect = (collection : string, object, relations = {}) => {
        const collectionDefinition = registry.collections[collection]
        if (!collectionDefinition) {
            throw new Error(`Unknown collection: ${collection}`)
        }

        const lonelyObject = pickBy((value, key) => {
            return !collectionDefinition.reverseRelationshipsByAlias[key]
        }, object)

        const placeholder = ++placeholdersCreated
        objectsByPlaceholder[placeholder] = lonelyObject
        const dissection = [
            {
                placeholder,
                collection,
                object: lonelyObject,
                relations,
            }
        ]

        for (const reverseRelationshipAlias in collectionDefinition.reverseRelationshipsByAlias) {
            let toCreate = object[reverseRelationshipAlias]
            if (!toCreate) {
                continue
            }
            
            const reverseRelationship = collectionDefinition.reverseRelationshipsByAlias[reverseRelationshipAlias]
            if (isChildOfRelationship(reverseRelationship)) {
                if (reverseRelationship.single) {
                    toCreate = [toCreate]
                }
                
                for (const objectToCreate of toCreate) {
                    dissection.push(...dissect(reverseRelationship.sourceCollection, objectToCreate, {[collection]: placeholder}))
                }
            } else if (isConnectsRelationship(reverseRelationship)) {
                if (object[reverseRelationshipAlias]) {
                    throw new Error('Sorry, creating connects relationships through put is not supported yet  :(')
                }
            } else {
                throw new Error(`Sorry, but I have no idea what kind of relationship you're trying to create`)
            }
        }

        return dissection
    }

    return {objects: dissect(operationDefinition.collection, operationDefinition.args)}
}
