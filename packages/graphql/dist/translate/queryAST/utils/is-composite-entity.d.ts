import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function isCompositeEntity(
    entity: ConcreteEntityAdapter | InterfaceEntityAdapter | UnionEntityAdapter | RelationshipAdapter
): entity is InterfaceEntityAdapter | UnionEntityAdapter;
//# sourceMappingURL=is-composite-entity.d.ts.map
