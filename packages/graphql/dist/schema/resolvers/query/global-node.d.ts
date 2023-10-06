import type { GraphQLResolveInfo } from "graphql";
import type { Node } from "../../../classes";
import type { Neo4jGraphQLComposedContext } from "../composition/wrap-query-and-mutation";
export declare function globalNodeResolver({ nodes }: { nodes: Node[] }): {
    type: string;
    resolve: (
        _root: any,
        args: {
            id: string;
        },
        context: Neo4jGraphQLComposedContext,
        info: GraphQLResolveInfo
    ) => Promise<null>;
    args: {
        id: string;
    };
};
//# sourceMappingURL=global-node.d.ts.map
