import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { UnionEntityAdapter } from "../../../schema-model/entity/model-adapters/UnionEntityAdapter";
/**
 *  Given a Record<string, any> representing a where argument for a composite target fields returns its concrete where argument.
    For instance, given:
    {
        Genre: { name: "Sci-Fi" },
        Movie: { title: "The Matrix" }
    }
    Returns { name: "Horror" } for the Genre concreteTarget.
    It also handles shared filters for interfaces, for instance:
    { title: "The Matrix", _on: { Movie: { director: "Wachowski" } } }
    will be transformed into:
    { title: "The Matrix", director: "Wachowski" }
**/
export declare function getConcreteWhere(
    compositeTarget: UnionEntityAdapter | InterfaceEntityAdapter,
    concreteTarget: ConcreteEntityAdapter,
    whereArgs?: Record<string, any>
): Record<string, any>;
//# sourceMappingURL=get-concrete-where.d.ts.map
