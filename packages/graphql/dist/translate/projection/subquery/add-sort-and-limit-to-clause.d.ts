import type { CypherField, CypherFieldReferenceMap, GraphQLOptionsArg } from "../../../types";
import Cypher from "@neo4j/cypher-builder";
import type { GraphElement } from "../../../classes";
export declare function addLimitOrOffsetOptionsToClause({
    optionsInput,
    projectionClause,
}: {
    optionsInput: GraphQLOptionsArg;
    projectionClause: Cypher.Return | Cypher.With;
}): void;
export declare function addSortAndLimitOptionsToClause({
    optionsInput,
    target,
    projectionClause,
    nodeField,
    fulltextScoreVariable,
    cypherFields,
    cypherFieldAliasMap,
    graphElement,
}: {
    optionsInput: GraphQLOptionsArg;
    target: Cypher.Variable | Cypher.Property;
    projectionClause: Cypher.Return | Cypher.With;
    nodeField?: string;
    fulltextScoreVariable?: Cypher.Variable;
    cypherFields?: CypherField[];
    cypherFieldAliasMap?: CypherFieldReferenceMap;
    graphElement?: GraphElement;
}): void;
//# sourceMappingURL=add-sort-and-limit-to-clause.d.ts.map
