import type { Directive, InputTypeComposer } from "graphql-compose";
export declare function addRelationshipArrayFilters({
    whereInput,
    fieldName,
    sourceName,
    relatedType,
    whereType,
    directives,
}: {
    whereInput: InputTypeComposer<any>;
    fieldName: string;
    sourceName: string;
    relatedType: string;
    whereType: InputTypeComposer<any> | string;
    directives: Directive[];
}): void;
//# sourceMappingURL=add-relationship-array-filters.d.ts.map
