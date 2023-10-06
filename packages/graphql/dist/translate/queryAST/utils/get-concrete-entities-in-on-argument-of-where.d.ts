import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
/**
 * Returns the concrete entities presents in the where [_on] argument,
 * if the where argument is not defined then returns all the concrete entities of the composite target.
 **/
export declare function getConcreteEntitiesInOnArgumentOfWhere(
    compositeTarget: UnionEntityAdapter | InterfaceEntityAdapter,
    whereArgs?: Record<string, any>
): ConcreteEntityAdapter[];
//# sourceMappingURL=get-concrete-entities-in-on-argument-of-where.d.ts.map
