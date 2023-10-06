import Cypher from "@neo4j/cypher-builder";
import type { QueryASTNode } from "../../QueryASTNode";
import type { OperationTranspileOptions, OperationTranspileResult } from "../operations";
import { Operation } from "../operations";
import type { CompositeReadPartial } from "./CompositeReadPartial";
import type { UnionEntityAdapter } from "../../../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { Pagination } from "../../pagination/Pagination";
import type { Sort, SortField } from "../../sort/Sort";
import type { QueryASTContext } from "../../QueryASTContext";
export declare class CompositeReadOperation extends Operation {
    private children;
    private entity;
    private relationship;
    protected pagination: Pagination | undefined;
    protected sortFields: Sort[];
    constructor({
        compositeEntity,
        children,
        relationship,
    }: {
        compositeEntity: InterfaceEntityAdapter | UnionEntityAdapter;
        children: CompositeReadPartial[];
        relationship: RelationshipAdapter | undefined;
    });
    getChildren(): QueryASTNode[];
    transpile(options: OperationTranspileOptions): OperationTranspileResult;
    addPagination(pagination: Pagination): void;
    addSort(...sortElement: Sort[]): void;
    protected getSortFields(context: QueryASTContext, target: Cypher.Variable): SortField[];
}
//# sourceMappingURL=CompositeReadOperation.d.ts.map
