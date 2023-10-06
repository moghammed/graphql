import { ConnectionReadOperation } from "../ConnectionReadOperation";
import type { OperationTranspileOptions, OperationTranspileResult } from "../operations";
import type { Sort } from "../../sort/Sort";
import type { Pagination } from "../../pagination/Pagination";
export declare class CompositeConnectionPartial extends ConnectionReadOperation {
    transpile({ returnVariable, context }: OperationTranspileOptions): OperationTranspileResult;
    addSort(sortElement: { node: Sort[]; edge: Sort[] }): void;
    addPagination(_pagination: Pagination): void;
}
//# sourceMappingURL=CompositeConnectionPartial.d.ts.map
