import { DEFAULT_INSPECTORS } from "./inspectors";

export interface StorageOperationInfo {
    components : Array<StorageOperationComponent>
    bulkOperation? : boolean
    isTransaction? : boolean
}
export interface StorageOperationComponent {
    conditional? : boolean
    collection? : string
    field? : string
    read? : boolean
    write? : boolean
}

export type StorageOperationInspector = ({operationDefinition} : {operationDefinition : any}) => StorageOperationInfo

export class StorageOperationInspection {
    private _inspectors : {[operationName : string] : StorageOperationInspector} = {...DEFAULT_INSPECTORS}

    registerInspector(operationName : string, inspector : StorageOperationInspector) {
        this._inspectors[operationName] = inspector
    }

    inspect(operationDefinition) {
        const inspector = this._inspectors[operationDefinition.operation]
        if (!inspector) {
            throw new Error(`Don't know how to inspect operation: '${operationDefinition.operation}'`)
        }
        return inspector({ operationDefinition })
    }
}
