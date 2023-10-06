import Cypher from "@neo4j/cypher-builder";
import type { ConcreteEntityAdapter } from "../../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { RelationshipAdapter } from "../../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { Neo4jGraphQLContext } from "../../../types/neo4j-graphql-context";
export declare function createNodeFromEntity(
    entity: ConcreteEntityAdapter,
    neo4jGraphQLContext?: Neo4jGraphQLContext,
    name?: string
): Cypher.Node;
export declare function createRelationshipFromEntity(rel: RelationshipAdapter, name?: string): Cypher.Relationship;
//# sourceMappingURL=create-node-from-entity.d.ts.map
