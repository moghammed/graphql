import type { Annotations } from "./annotation/Annotation";
import { AttributeAdapter } from "./attribute/model-adapters/AttributeAdapter";
import type { Operation } from "./Operation";
export declare class OperationAdapter {
    readonly name: string;
    readonly attributes: Map<string, AttributeAdapter>;
    readonly annotations: Partial<Annotations>;
    constructor(entity: Operation);
    private initAttributes;
    get objectFields(): AttributeAdapter[];
}
//# sourceMappingURL=OperationAdapter.d.ts.map
