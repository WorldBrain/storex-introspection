export type StorageOperationIntrospector = ({operationDefinition} : {operationDefinition : any}) => any
export class StorageOperationIntrospection {
    private _inspectors : {[operationName : string] : StorageOperationIntrospector} = {}

    registerInspector(operationName : string, inspector : StorageOperationIntrospector) {
        this._inspectors[operationName] = inspector
    }

    inspect(operationDefinition) {
        return this._inspectors[operationDefinition.operation]({operationDefinition})
    }
}
