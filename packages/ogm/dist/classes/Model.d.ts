import type { DocumentNode, GraphQLSchema, SelectionSetNode } from "graphql";
import type { GraphQLOptionsArg, GraphQLWhereArg, DeleteInfo } from "../types";
import type { Neo4jGraphQLContext } from "@neo4j/graphql";
type Neo4jGraphQLOGMContext = Omit<Neo4jGraphQLContext, "jwt" | "token">;
type RootTypeFieldNames = {
    create: string;
    read: string;
    update: string;
    delete: string;
    aggregate: string;
};
declare class Model {
    name: string;
    private _namePluralized?;
    private _selectionSet?;
    private schema?;
    private _rootTypeFieldNames?;
    private database?;
    constructor(name: string, database?: string);
    set selectionSet(selectionSet: string | DocumentNode);
    private get namePluralized();
    private get rootTypeFieldNames();
    init({
        schema,
        selectionSet,
        namePluralized,
        rootTypeFieldNames,
    }: {
        schema: GraphQLSchema;
        selectionSet: string | DocumentNode;
        namePluralized: string;
        rootTypeFieldNames: RootTypeFieldNames;
    }): void;
    find<T = any[]>({
        where,
        fulltext,
        options,
        selectionSet,
        args,
        context,
        rootValue,
    }?: {
        where?: GraphQLWhereArg;
        fulltext?: any;
        options?: GraphQLOptionsArg;
        selectionSet?: string | DocumentNode | SelectionSetNode;
        args?: any;
        context?: Neo4jGraphQLOGMContext;
        rootValue?: any;
    }): Promise<T>;
    create<T = any>({
        input,
        selectionSet,
        args,
        context,
        rootValue,
    }?: {
        input?: any;
        selectionSet?: string | DocumentNode | SelectionSetNode;
        args?: any;
        context?: Neo4jGraphQLOGMContext;
        rootValue?: any;
    }): Promise<T>;
    update<T = any>({
        where,
        update,
        connect,
        disconnect,
        create,
        connectOrCreate,
        selectionSet,
        args,
        context,
        rootValue,
    }?: {
        where?: GraphQLWhereArg;
        update?: any;
        connect?: any;
        disconnect?: any;
        connectOrCreate?: any;
        create?: any;
        selectionSet?: string | DocumentNode | SelectionSetNode;
        args?: any;
        context?: Neo4jGraphQLOGMContext;
        rootValue?: any;
    }): Promise<T>;
    delete({
        where,
        delete: deleteInput,
        context,
        rootValue,
    }?: {
        where?: GraphQLWhereArg;
        delete?: any;
        context?: Neo4jGraphQLOGMContext;
        rootValue?: any;
    }): Promise<DeleteInfo>;
    aggregate<T = any>({
        where,
        fulltext,
        aggregate,
        context,
        rootValue,
    }: {
        where?: GraphQLWhereArg;
        fulltext?: any;
        aggregate: Record<string, unknown>;
        context?: Neo4jGraphQLOGMContext;
        rootValue?: any;
    }): Promise<T>;
    private getSelectionSetOrDefault;
}
export default Model;
//# sourceMappingURL=Model.d.ts.map