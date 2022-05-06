/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { graphql, GraphQLSchema } from "graphql";
import { Driver } from "neo4j-driver";
import { Neo4jGraphQLAuthJWTPlugin } from "@neo4j/graphql-plugin-auth";
import neo4j from "../neo4j";
import { Neo4jGraphQL } from "../../../src";
import { generateUniqueType } from "../../utils/graphql-types";
import { runCypher } from "../../utils/run-cypher";
import { createJwtRequest } from "../../utils/create-jwt-request";

describe("https://github.com/neo4j/graphql/issues/1115", () => {
    const parentType = generateUniqueType("Parent");
    const childType = generateUniqueType("Child");

    let schema: GraphQLSchema;
    let driver: Driver;

    beforeAll(async () => {
        driver = await neo4j();

        const typeDefs = `
            type ${parentType} {
                children: [${childType}!]! @relationship(type: "HAS", direction: IN)
            }
            type ${childType} {
                tcId: String @unique
            }

            extend type ${childType}
                @auth(
                    rules: [
                        { operations: [READ, CREATE, UPDATE, DELETE, CONNECT, DISCONNECT], roles: ["upstream"] }
                        { operations: [READ], roles: ["downstream"] }
                    ]
                )
        `;
        const neoGraphql = new Neo4jGraphQL({
            typeDefs,
            driver,
            plugins: {
                auth: new Neo4jGraphQLAuthJWTPlugin({
                    secret: "secret",
                }),
            },
        });
        schema = await neoGraphql.getSchema();
    });

    afterAll(async () => {
        await driver.close();
    });

    test("should not throw on multiple connectOrCreate with auth", async () => {
        await runCypher(driver, `CREATE (:${parentType})<-[:HAS]-(:${childType} {tcId: "123"})`);

        const req = createJwtRequest("secret", { roles: ["upstream"] });
        const query = `
        mutation {
          ${parentType.operations.update}(
            connectOrCreate: {
              children: [
                {
                  where: { node: { tcId: "123" } }
                  onCreate: { node: { tcId: "123" } }
                }
                {
                  where: { node: { tcId: "456" } }
                  onCreate: { node: { tcId: "456" } }
                }
              ]
            }
          ) {
            info {
              nodesCreated
            }
          }
        }
        `;

        const res = await graphql({
            schema,
            source: query,
            contextValue: {
                driver,
                req,
            },
        });

        expect(res.errors).toBeUndefined();
        expect(res.data).toEqual({
            [parentType.operations.update]: { info: { nodesCreated: 1 } },
        });
    });
});