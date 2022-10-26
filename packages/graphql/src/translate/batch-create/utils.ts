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

import type { Context, RelationField } from "../../types";
import type { Node, Relationship } from "../../classes";
import * as CypherBuilder from "../cypher-builder/CypherBuilder";
import mapToDbProperty from "../../utils/map-to-db-property";

export function getRelationshipFields(
    node: Node,
    key: string,
    value: any,
    context: Context
): [RelationField | undefined, Node[]] {
    const relationField = node.relationFields.find((x) => key === x.fieldName);
    const refNodes: Node[] = [];

    if (relationField) {
        if (relationField.union) {
            Object.keys(value as Record<string, any>).forEach((unionTypeName) => {
                refNodes.push(context.nodes.find((x) => x.name === unionTypeName) as Node);
            });
        } else if (relationField.interface) {
            relationField.interface?.implementations?.forEach((implementationName) => {
                refNodes.push(context.nodes.find((x) => x.name === implementationName) as Node);
            });
        } else {
            refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name) as Node);
        }
    }
    return [relationField, refNodes];
}

export function getAutoGeneratedFields(graphQLElement: Node | Relationship, cypherNodeRef: CypherBuilder.Node | CypherBuilder.Relationship): CypherBuilder.SetParam[] {
    const setParams: CypherBuilder.SetParam[] = [];
    const timestampedFields = graphQLElement.temporalFields.filter(
        (x) => ["DateTime", "Time"].includes(x.typeMeta.name) && x.timestamps?.includes("CREATE")
    );
    timestampedFields.forEach((field) => {
        // DateTime -> datetime(); Time -> time()
        const relatedCypherExpression = CypherBuilder[field.typeMeta.name.toLowerCase()]() as CypherBuilder.Expr;
        setParams.push([
            cypherNodeRef.property(field.dbPropertyName as string),
            relatedCypherExpression,
        ] as CypherBuilder.SetParam);
    });

    const autogeneratedIdFields = graphQLElement.primitiveFields.filter((x) => x.autogenerate);
    autogeneratedIdFields.forEach((field) => {
        setParams.push([
            cypherNodeRef.property(field.dbPropertyName as string),
            CypherBuilder.randomUUID(),
        ] as CypherBuilder.SetParam);
    });
    return setParams;
}

export function fieldToSetParam(graphQLElement: Node | Relationship, cypherNodeRef: CypherBuilder.Node | CypherBuilder.Relationship, key: string, value: CypherBuilder.Expr): CypherBuilder.SetParam {
    const pointField = graphQLElement.pointFields.find((x) => key === x.fieldName);
    const dbName = mapToDbProperty(graphQLElement, key);
    if (pointField) {
        if (pointField.typeMeta.array) {
            const comprehensionVar = new CypherBuilder.Variable();
            const mapPoint = CypherBuilder.point(comprehensionVar);
            const expression = new CypherBuilder.ListComprehension(comprehensionVar, value).map(mapPoint);
            return [cypherNodeRef.property(dbName), expression];
        }
        return [cypherNodeRef.property(dbName), CypherBuilder.point(value)];
    }
    return [cypherNodeRef.property(dbName), value];
}