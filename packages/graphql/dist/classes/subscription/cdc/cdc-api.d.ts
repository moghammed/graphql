import type { Driver } from "neo4j-driver";
import type { CDCEvent } from "./cdc-types";
export declare class CDCApi {
    private driver;
    private lastChangeId;
    constructor(driver: Driver);
    queryEvents(): Promise<CDCEvent[]>;
    private fetchCurrentChangeId;
    private updateChangeIdWithLastEvent;
    private runProcedure;
}
//# sourceMappingURL=cdc-api.d.ts.map
