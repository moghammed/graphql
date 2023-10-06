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
import type { ObjectTypeComposer, SchemaComposer, InterfaceTypeComposer } from "graphql-compose";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import { augmentObjectOrInterfaceTypeWithRelationshipField } from "../generation/augment-object-or-interface";
import { augmentConnectInputTypeWithConnectFieldInput } from "../generation/connect-input";
import { withConnectOrCreateInputType } from "../generation/connect-or-create-input";
import { augmentCreateInputTypeWithRelationshipsInput } from "../generation/create-input";
import { augmentDeleteInputTypeWithDeleteFieldInput } from "../generation/delete-input";
import { augmentDisconnectInputTypeWithDisconnectFieldInput } from "../generation/disconnect-input";
import { withRelationInputType } from "../generation/relation-input";
import { augmentUpdateInputTypeWithUpdateFieldInput } from "../generation/update-input";

export function createRelationshipUnionFields({
    relationship,
    composeNode,
    schemaComposer,
    userDefinedFieldDirectives,
}: {
    relationship: RelationshipAdapter;
    composeNode: ObjectTypeComposer | InterfaceTypeComposer;
    schemaComposer: SchemaComposer;
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>;
}) {
    // ======== only on relationships to concrete | unions:
    withConnectOrCreateInputType({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        userDefinedFieldDirectives,
        deprecatedDirectives: [],
    });

    // ======== all relationships:
    composeNode.addFields(augmentObjectOrInterfaceTypeWithRelationshipField(relationship, userDefinedFieldDirectives));

    withRelationInputType({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
        userDefinedFieldDirectives,
    });

    augmentCreateInputTypeWithRelationshipsInput({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
        userDefinedFieldDirectives,
    });

    augmentUpdateInputTypeWithUpdateFieldInput({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
        userDefinedFieldDirectives,
    });

    augmentConnectInputTypeWithConnectFieldInput({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
    });

    augmentDeleteInputTypeWithDeleteFieldInput({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
    });

    augmentDisconnectInputTypeWithDisconnectFieldInput({
        relationshipAdapter: relationship,
        composer: schemaComposer,
        deprecatedDirectives: [],
    });
}
