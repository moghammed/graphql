import type { ConcreteEntity } from "./ConcreteEntity";
import type { CompositeEntity } from "./CompositeEntity";
export declare class UnionEntity implements CompositeEntity {
    readonly name: string;
    concreteEntities: ConcreteEntity[];
    constructor({ name, concreteEntities }: { name: string; concreteEntities: ConcreteEntity[] });
    isConcreteEntity(): this is ConcreteEntity;
    isCompositeEntity(): this is CompositeEntity;
}
//# sourceMappingURL=UnionEntity.d.ts.map
