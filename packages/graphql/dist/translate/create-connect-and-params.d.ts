import type { Node } from "../classes";
import type { RelationField } from "../types";
import type { CallbackBucket } from "../classes/CallbackBucket";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
declare function createConnectAndParams({
    withVars,
    value,
    varName,
    relationField,
    parentVar,
    refNodes,
    context,
    callbackBucket,
    labelOverride,
    parentNode,
    includeRelationshipValidation,
    isFirstLevel,
    source,
}: {
    withVars: string[];
    value: any;
    varName: string;
    relationField: RelationField;
    parentVar: string;
    context: Neo4jGraphQLTranslationContext;
    callbackBucket: CallbackBucket;
    refNodes: Node[];
    labelOverride?: string;
    parentNode: Node;
    includeRelationshipValidation?: boolean;
    isFirstLevel?: boolean;
    source: "CREATE" | "UPDATE" | "CONNECT";
}): [string, any];
export default createConnectAndParams;
//# sourceMappingURL=create-connect-and-params.d.ts.map