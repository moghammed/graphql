import type { Annotation, Annotations } from "../annotation/Annotation";
export declare class Field {
    readonly name: string;
    readonly annotations: Partial<Annotations>;
    constructor({ name, annotations }: { name: string; annotations: Annotation[] });
    clone(): Field;
    private addAnnotation;
}
//# sourceMappingURL=Field.d.ts.map
