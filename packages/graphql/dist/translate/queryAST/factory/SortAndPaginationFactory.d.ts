import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { ConnectionSortArg, GraphQLOptionsArg } from "../../../types";
import { Pagination } from "../ast/pagination/Pagination";
import type { Sort } from "../ast/sort/Sort";
export declare class SortAndPaginationFactory {
    createSortFields(
        options: GraphQLOptionsArg,
        entity: ConcreteEntityAdapter | RelationshipAdapter | InterfaceEntityAdapter | UnionEntityAdapter
    ): Sort[];
    createConnectionSortFields(
        options: ConnectionSortArg,
        relationship: RelationshipAdapter
    ): {
        edge: Sort[];
        node: Sort[];
    };
    createPagination(options: GraphQLOptionsArg): Pagination | undefined;
    private createPropertySort;
}
//# sourceMappingURL=SortAndPaginationFactory.d.ts.map
