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
import type { DirectiveNode } from "graphql";
import type { InterfaceTypeComposer, SchemaComposer } from "graphql-compose";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import {
    attributeAdapterToComposeFields,
    graphqlDirectivesToCompose,
    relationshipAdapterToComposeFields,
} from "../to-compose";

export function withInterfaceType({
    entityAdapter,
    userDefinedFieldDirectives,
    userDefinedInterfaceDirectives,
    composer,
    config = {
        includeRelationships: false,
    },
}: {
    entityAdapter: InterfaceEntityAdapter | RelationshipAdapter;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
    userDefinedInterfaceDirectives: DirectiveNode[];
    composer: SchemaComposer;
    config?: {
        includeRelationships: boolean;
    };
}): InterfaceTypeComposer {
    // TODO: maybe create interfaceEntity.interfaceFields() method abstraction even if it retrieves all attributes?
    // can also take includeRelationships as argument
    const objectComposeFields = attributeAdapterToComposeFields(
        Array.from(entityAdapter.attributes.values()),
        userDefinedFieldDirectives
    );
    let fields = objectComposeFields;
    if (config.includeRelationships && entityAdapter instanceof InterfaceEntityAdapter) {
        fields = {
            ...fields,
            ...relationshipAdapterToComposeFields(
                Array.from(entityAdapter.relationships.values()),
                userDefinedFieldDirectives
            ),
        };
    }
    const interfaceTypeName =
        entityAdapter instanceof InterfaceEntityAdapter
            ? entityAdapter.name
            : (entityAdapter.propertiesTypeName as string); // this is checked one layer above in execution
    const composeInterface = composer.createInterfaceTC({
        name: interfaceTypeName,
        fields: fields,
        directives: graphqlDirectivesToCompose(userDefinedInterfaceDirectives),
    });
    return composeInterface;
}
