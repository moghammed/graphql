import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
export declare function isUnionEntity(
    entity: ConcreteEntityAdapter | InterfaceEntityAdapter | UnionEntityAdapter | RelationshipAdapter
): entity is UnionEntityAdapter;
//# sourceMappingURL=is-union-entity.d.ts.map
