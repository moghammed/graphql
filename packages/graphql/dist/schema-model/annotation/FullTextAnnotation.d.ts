export type FullTextField = {
    name: string;
    fields: string[];
    queryName: string;
    indexName: string;
};
export declare class FullTextAnnotation {
    readonly indexes: FullTextField[];
    constructor({ indexes }: { indexes: FullTextField[] });
}
//# sourceMappingURL=FullTextAnnotation.d.ts.map
