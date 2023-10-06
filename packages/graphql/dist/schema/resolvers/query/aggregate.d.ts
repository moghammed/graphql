import type { GraphQLResolveInfo } from "graphql";
import type { Node } from "../../../classes";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { Neo4jGraphQLComposedContext } from "../composition/wrap-query-and-mutation";
export declare function aggregateResolver({
    node,
    concreteEntityAdapter,
}: {
    node: Node;
    concreteEntityAdapter: ConcreteEntityAdapter;
}): {
    type: string;
    resolve: (_root: any, _args: any, context: Neo4jGraphQLComposedContext, info: GraphQLResolveInfo) => Promise<any>;
    args: {
        fulltext?:
            | {
                  type: string;
                  description: string;
              }
            | undefined;
        where: string;
    };
};
//# sourceMappingURL=aggregate.d.ts.map