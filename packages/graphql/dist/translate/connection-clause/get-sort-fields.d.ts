import type { ResolveTree } from "graphql-parse-resolve-info";
import type { GraphQLSortArg } from "../../types";
export type SortFields =
    | {
          edge: GraphQLSortArg;
      }
    | {
          node: GraphQLSortArg;
      };
export declare function getSortFields(resolveTree: ResolveTree): SortFields[];
/** Returns keys of sort fields on edges for connections */
export declare function getEdgeSortFieldKeys(resolveTree: ResolveTree): string[];
//# sourceMappingURL=get-sort-fields.d.ts.map