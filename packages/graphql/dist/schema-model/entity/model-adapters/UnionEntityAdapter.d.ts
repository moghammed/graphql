import type { UnionEntity } from "../UnionEntity";
import { ConcreteEntityAdapter } from "./ConcreteEntityAdapter";
import { UnionEntityOperations } from "./UnionEntityOperations";
export declare class UnionEntityAdapter {
    readonly name: string;
    concreteEntities: ConcreteEntityAdapter[];
    private _singular;
    private _plural;
    private _operations;
    constructor(entity: UnionEntity);
    private initConcreteEntities;
    get operations(): UnionEntityOperations;
    get singular(): string;
    get plural(): string;
}
//# sourceMappingURL=UnionEntityAdapter.d.ts.map
