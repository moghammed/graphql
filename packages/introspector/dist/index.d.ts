import type { Session } from "neo4j-driver";
import graphqlFormatter from "./transforms/neo4j-graphql";
import type { Neo4jStruct } from "./types";
export { graphqlFormatter };
export declare function toGenericStruct(sessionFactory: () => Session): Promise<Neo4jStruct>;
export declare function toGraphQLTypeDefs(sessionFactory: () => Session, readonly?: boolean): Promise<string>;
//# sourceMappingURL=index.d.ts.map
