import type { RelationField } from "../types";
export type DirectionString = "-" | "->" | "<-";
export type QueryRelationshipDirection = "IN" | "OUT" | "undirected";
export type CypherRelationshipDirection = "left" | "right" | "undirected";
type DirectionResult = {
    inStr: DirectionString;
    outStr: DirectionString;
};
export declare function getCypherRelationshipDirection(
    relationField: RelationField,
    fieldArgs?: {
        directed?: boolean;
    }
): CypherRelationshipDirection;
export declare function getRelationshipDirection(
    relationField: RelationField,
    fieldArgs: {
        directed?: boolean;
    }
): QueryRelationshipDirection;
export declare function getRelationshipDirectionStr(
    relationField: RelationField,
    fieldArgs: {
        directed?: boolean;
    }
): DirectionResult;
export {};
//# sourceMappingURL=get-relationship-direction.d.ts.map
