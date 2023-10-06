import type { RelationshipAdapter } from "../../relationship/model-adapters/RelationshipAdapter";
export declare class ListFiltersAdapter {
    readonly relationshipAdapter: RelationshipAdapter;
    constructor(relationshipAdapter: RelationshipAdapter);
    getAll(): {
        type: string;
        description: string;
    };
    getNone(): {
        type: string;
        description: string;
    };
    getSingle(): {
        type: string;
        description: string;
    };
    getSome(): {
        type: string;
        description: string;
    };
    get filters(): {
        type: string;
        description: string;
    }[];
    getConnectionAll(): {
        type: string;
        description: string;
    };
    getConnectionNone(): {
        type: string;
        description: string;
    };
    getConnectionSingle(): {
        type: string;
        description: string;
    };
    getConnectionSome(): {
        type: string;
        description: string;
    };
    get connectionFilters(): {
        type: string;
        description: string;
    }[];
}
//# sourceMappingURL=ListFiltersAdapter.d.ts.map
