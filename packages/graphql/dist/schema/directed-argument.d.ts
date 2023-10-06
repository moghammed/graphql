import type { RelationshipAdapter } from "../schema-model/relationship/model-adapters/RelationshipAdapter";
export type DirectedArgument = {
    type: "Boolean";
    defaultValue: boolean;
};
export declare function getDirectedArgument(relationshipAdapter: RelationshipAdapter): DirectedArgument | undefined;
export declare function addDirectedArgument<T extends Record<string, any>>(
    args: T,
    relationshipAdapter: RelationshipAdapter
): T & {
    directed?: DirectedArgument;
};
//# sourceMappingURL=directed-argument.d.ts.map
