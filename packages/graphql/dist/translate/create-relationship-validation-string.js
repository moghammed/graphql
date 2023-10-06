"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
function createRelationshipValidationString({ node, context, varName, relationshipFieldNotOverwritable, }) {
    const strs = [];
    node.relationFields.forEach((field) => {
        const isArray = field.typeMeta.array;
        const isUnionOrInterface = Boolean(field.union) || Boolean(field.interface);
        if (isUnionOrInterface) {
            return;
        }
        const toNode = context.nodes.find((n) => n.name === field.typeMeta.name);
        const inStr = field.direction === "IN" ? "<-" : "-";
        const outStr = field.direction === "OUT" ? "->" : "-";
        const relVarname = `${varName}_${field.fieldName}_${toNode.name}_unique`;
        let predicate;
        let errorMsg;
        let subQuery;
        if (isArray) {
            if (relationshipFieldNotOverwritable === field.fieldName) {
                predicate = `c = 1`;
                errorMsg = `${constants_1.RELATIONSHIP_REQUIREMENT_PREFIX}${node.name}.${field.fieldName} required exactly once for a specific ${toNode.name}`;
                subQuery = [
                    `CALL {`,
                    `\tWITH ${varName}`,
                    `\tMATCH (${varName})${inStr}[${relVarname}:${field.type}]${outStr}(other${toNode.getLabelString(context)})`,
                    `\tWITH count(${relVarname}) as c, other`,
                    `\tWHERE apoc.util.validatePredicate(NOT (${predicate}), '${errorMsg}', [0])`,
                    `\tRETURN collect(c) AS ${relVarname}_ignored`,
                    `}`,
                ].join("\n");
            }
        }
        else {
            predicate = `c = 1`;
            errorMsg = `${constants_1.RELATIONSHIP_REQUIREMENT_PREFIX}${node.name}.${field.fieldName} required exactly once`;
            if (!field.typeMeta.required) {
                predicate = `c <= 1`;
                errorMsg = `${constants_1.RELATIONSHIP_REQUIREMENT_PREFIX}${node.name}.${field.fieldName} must be less than or equal to one`;
            }
            subQuery = [
                `CALL {`,
                `\tWITH ${varName}`,
                `\tMATCH (${varName})${inStr}[${relVarname}:${field.type}]${outStr}(${toNode.getLabelString(context)})`,
                `\tWITH count(${relVarname}) as c`,
                `\tWHERE apoc.util.validatePredicate(NOT (${predicate}), '${errorMsg}', [0])`,
                `\tRETURN c AS ${relVarname}_ignored`,
                `}`,
            ].join("\n");
        }
        if (subQuery) {
            strs.push(subQuery);
        }
    });
    return strs.join("\n");
}
exports.default = createRelationshipValidationString;
//# sourceMappingURL=create-relationship-validation-string.js.map