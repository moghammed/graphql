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

import type { ResolveTree } from "graphql-parse-resolve-info";
import type { PointField } from "../../../types";

function createPointElement({
    resolveTree,
    field,
    variable,
}: {
    resolveTree: ResolveTree;
    field: PointField;
    variable: string;
}): string {
    const isArray = field.typeMeta.array;

    const { crs, ...point } = resolveTree.fieldsByTypeName[field.typeMeta.name];
    const fields: string[] = [];
    const dbFieldName = field.dbPropertyName || resolveTree.name;

    // Sadly need to select the whole point object due to the risk of height/z
    // being selected on a 2D point, to which the database will throw an error
    if (point) {
        fields.push(isArray ? "point:p" : `point: ${variable}.${dbFieldName}`);
    }

    if (crs) {
        fields.push(isArray ? "crs: p.crs" : `crs: ${variable}.${dbFieldName}.crs`);
    }

    const projection = isArray
        ? `[p in ${variable}.${dbFieldName} | { ${fields.join(", ")} }]`
        : `{ ${fields.join(", ")} }`;

    const cypher = [
        "apoc.cypher.runFirstColumnSingle(",
        `'RETURN\nCASE\n\tWHEN ${variable}.${dbFieldName} IS NOT NULL THEN ${projection}\n\tELSE NULL\nEND AS result',`,
        `{ ${variable}: ${variable} }`,
        ")",
    ];

    return `${resolveTree.alias}: ${cypher.join("")}`;
}

export default createPointElement;
