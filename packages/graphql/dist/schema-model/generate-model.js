"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModel = void 0;
const classes_1 = require("../classes");
const directives_1 = require("../graphql/directives");
const get_field_type_meta_1 = __importDefault(require("../schema/get-field-type-meta"));
const utils_1 = require("../utils/utils");
const Neo4jGraphQLSchemaModel_1 = require("./Neo4jGraphQLSchemaModel");
const Operation_1 = require("./Operation");
const ConcreteEntity_1 = require("./entity/ConcreteEntity");
const InterfaceEntity_1 = require("./entity/InterfaceEntity");
const UnionEntity_1 = require("./entity/UnionEntity");
const key_annotation_1 = require("./parser/annotations-parser/key-annotation");
const definition_collection_1 = require("./parser/definition-collection");
const parse_annotation_1 = require("./parser/parse-annotation");
const parse_arguments_1 = require("./parser/parse-arguments");
const parse_attribute_1 = require("./parser/parse-attribute");
const utils_2 = require("./parser/utils");
const Relationship_1 = require("./relationship/Relationship");
const constants_1 = require("../constants");
function generateModel(document) {
    const definitionCollection = (0, definition_collection_1.getDefinitionCollection)(document);
    const operations = definitionCollection.operations.reduce((acc, definition) => {
        acc[definition.name.value] = generateOperation(definition, definitionCollection);
        return acc;
    }, {});
    // hydrate interface to typeNames map
    hydrateInterfacesToTypeNamesMap(definitionCollection);
    const concreteEntities = Array.from(definitionCollection.nodes.values()).map((node) => generateConcreteEntity(node, definitionCollection));
    const concreteEntitiesMap = concreteEntities.reduce((acc, entity) => {
        if (acc.has(entity.name)) {
            throw new classes_1.Neo4jGraphQLSchemaValidationError(`Duplicate node ${entity.name}`);
        }
        acc.set(entity.name, entity);
        return acc;
    }, new Map());
    const interfaceEntities = Array.from(definitionCollection.interfaceToImplementingTypeNamesMap.entries()).map(([name, concreteEntities]) => {
        const interfaceNode = definitionCollection.interfaceTypes.get(name);
        if (!interfaceNode) {
            throw new Error(`Cannot find interface ${name}`);
        }
        return generateInterfaceEntity(name, interfaceNode, concreteEntities, concreteEntitiesMap, definitionCollection);
    });
    const unionEntities = Array.from(definitionCollection.unionTypes).map(([unionName, unionDefinition]) => {
        return generateUnionEntity(unionName, unionDefinition.types?.map((t) => t.name.value) || [], concreteEntitiesMap);
    });
    const annotations = createSchemaModelAnnotations(definitionCollection.schemaDirectives);
    const schema = new Neo4jGraphQLSchemaModel_1.Neo4jGraphQLSchemaModel({
        compositeEntities: [...unionEntities, ...interfaceEntities],
        concreteEntities,
        operations,
        annotations,
    });
    definitionCollection.nodes.forEach((def) => hydrateRelationships(def, schema, definitionCollection));
    definitionCollection.interfaceTypes.forEach((def) => hydrateRelationships(def, schema, definitionCollection));
    addCompositeEntitiesToConcreteEntity(interfaceEntities);
    addCompositeEntitiesToConcreteEntity(unionEntities);
    return schema;
}
exports.generateModel = generateModel;
function addCompositeEntitiesToConcreteEntity(compositeEntities) {
    compositeEntities.forEach((compositeEntity) => {
        compositeEntity.concreteEntities.forEach((concreteEntity) => concreteEntity.addCompositeEntities(compositeEntity));
    });
}
function hydrateInterfacesToTypeNamesMap(definitionCollection) {
    return definitionCollection.nodes.forEach((node) => {
        if (!node.interfaces) {
            return;
        }
        const objectTypeName = node.name.value;
        node.interfaces?.forEach((i) => {
            const interfaceTypeName = i.name.value;
            const concreteEntities = definitionCollection.interfaceToImplementingTypeNamesMap.get(interfaceTypeName);
            if (!concreteEntities) {
                throw new classes_1.Neo4jGraphQLSchemaValidationError(`Could not find composite entity with name ${interfaceTypeName}`);
            }
            // TODO: modify the existing array instead of creating a new one
            definitionCollection.interfaceToImplementingTypeNamesMap.set(interfaceTypeName, concreteEntities.concat(objectTypeName));
        });
    });
}
function generateUnionEntity(entityDefinitionName, entityImplementingTypeNames, concreteEntities) {
    const unionEntity = generateCompositeEntity(entityDefinitionName, entityImplementingTypeNames, concreteEntities);
    return new UnionEntity_1.UnionEntity(unionEntity);
}
function generateInterfaceEntity(entityDefinitionName, definition, entityImplementingTypeNames, concreteEntities, definitionCollection) {
    const interfaceEntity = generateCompositeEntity(entityDefinitionName, entityImplementingTypeNames, concreteEntities);
    const inheritedFields = definition.interfaces?.flatMap((interfaceNamedNode) => {
        const interfaceName = interfaceNamedNode.name.value;
        return definitionCollection.interfaceTypes.get(interfaceName)?.fields || [];
    }) || [];
    const fields = (definition.fields || []).map((fieldDefinition) => {
        const inheritedField = inheritedFields?.filter((inheritedField) => inheritedField.name.value === fieldDefinition.name.value);
        const isPrivateAttribute = (0, utils_2.findDirective)(fieldDefinition.directives, directives_1.privateDirective.name);
        const isInheritedPrivateAttribute = inheritedField?.some((inheritedField) => (0, utils_2.findDirective)(inheritedField.directives, directives_1.privateDirective.name));
        if (isPrivateAttribute || isInheritedPrivateAttribute) {
            return;
        }
        const isRelationshipAttribute = (0, utils_2.findDirective)(fieldDefinition.directives, directives_1.relationshipDirective.name);
        const isInheritedRelationshipAttribute = inheritedField?.some((inheritedField) => (0, utils_2.findDirective)(inheritedField.directives, directives_1.relationshipDirective.name));
        if (isRelationshipAttribute || isInheritedRelationshipAttribute) {
            return;
        }
        return (0, parse_attribute_1.parseAttribute)(fieldDefinition, inheritedField, definitionCollection, definition.fields);
    });
    const inheritedDirectives = definition.interfaces?.flatMap((interfaceNamedNode) => {
        const interfaceName = interfaceNamedNode.name.value;
        return definitionCollection.interfaceTypes.get(interfaceName)?.directives || [];
    }) || [];
    const mergedDirectives = (definition.directives || []).concat(inheritedDirectives);
    const annotations = createEntityAnnotations(mergedDirectives);
    return new InterfaceEntity_1.InterfaceEntity({
        ...interfaceEntity,
        description: definition.description?.value,
        attributes: (0, utils_1.filterTruthy)(fields),
        annotations,
    });
}
function generateCompositeEntity(entityDefinitionName, entityImplementingTypeNames, concreteEntities) {
    const compositeFields = entityImplementingTypeNames.map((type) => {
        const concreteEntity = concreteEntities.get(type);
        if (!concreteEntity) {
            throw new classes_1.Neo4jGraphQLSchemaValidationError(`Could not find concrete entity with name ${type}`);
        }
        return concreteEntity;
    });
    /*
   // This is commented out because is currently possible to have leaf interfaces as demonstrated in the test
   // packages/graphql/tests/integration/aggregations/where/node/string.int.test.ts
   if (!compositeFields.length) {
        throw new Neo4jGraphQLSchemaValidationError(
            `Composite entity ${entityDefinitionName} has no concrete entities`
        );
    } */
    return {
        name: entityDefinitionName,
        concreteEntities: compositeFields,
    };
}
function hydrateRelationships(definition, schema, definitionCollection) {
    const name = definition.name.value;
    const entity = schema.getEntity(name);
    if (!entity) {
        throw new Error(`Cannot find entity ${name}`);
    }
    if (entity instanceof UnionEntity_1.UnionEntity) {
        throw new Error(`Cannot add relationship to union entity ${name}`);
    }
    // TODO: fix ts
    const entityWithRelationships = entity;
    const inheritedFields = definition.interfaces?.flatMap((interfaceNamedNode) => {
        const interfaceName = interfaceNamedNode.name.value;
        return definitionCollection.interfaceTypes.get(interfaceName)?.fields || [];
    }) || [];
    // TODO: directives on definition have priority over interfaces
    const mergedFields = (definition.fields || []).concat(inheritedFields);
    const relationshipFieldsMap = new Map();
    for (const fieldDefinition of mergedFields) {
        // TODO: takes the first one
        // multiple interfaces can have this annotation - must constrain this flexibility by design
        if (relationshipFieldsMap.has(fieldDefinition.name.value)) {
            continue;
        }
        const mergedDirectives = mergedFields
            .filter((f) => f.name.value === fieldDefinition.name.value)
            .flatMap((f) => f.directives || []);
        const relationshipField = generateRelationshipField(fieldDefinition, schema, entityWithRelationships, definitionCollection, mergedDirectives, getInterfaceNameIfInheritedField(definition, fieldDefinition.name.value, definitionCollection));
        if (relationshipField) {
            relationshipFieldsMap.set(fieldDefinition.name.value, relationshipField);
        }
    }
    for (const relationship of relationshipFieldsMap.values()) {
        entityWithRelationships.addRelationship(relationship);
    }
}
function getInterfaceNameIfInheritedField(definition, fieldName, definitionCollection) {
    // TODO: potentially use this instead
    // const fieldNameToSourceNameMap = definition.interfaces?.reduce((acc, interfaceNamedNode) => {
    //     const interfaceName = interfaceNamedNode.name.value;
    //     const fields = definitionCollection.interfaceTypes.get(interfaceName)?.fields || [];
    //     fields.forEach((f) => {
    //         const exists = acc.has(f.name.value);
    //         if (!exists) {
    //             acc.set(f.name.value, interfaceName);
    //         }
    //     });
    //     return acc;
    // }, new Map<string, string>());
    // deliberately using the first interface ONLY
    const fieldNameToSourceNameMap = new Map();
    const firstInterfaceName = definition.interfaces?.[0]?.name.value;
    if (firstInterfaceName) {
        const fields = definitionCollection.interfaceTypes.get(firstInterfaceName)?.fields || [];
        fields.forEach((field) => fieldNameToSourceNameMap.set(field.name.value, firstInterfaceName));
    }
    return fieldNameToSourceNameMap?.get(fieldName);
}
function generateRelationshipField(field, schema, source, definitionCollection, mergedDirectives, inheritedFrom) {
    // TODO: remove reference to getFieldTypeMeta
    const fieldTypeMeta = (0, get_field_type_meta_1.default)(field.type);
    const relationshipUsage = (0, utils_2.findDirective)(field.directives, "relationship");
    if (!relationshipUsage)
        return undefined;
    const fieldName = field.name.value;
    const relatedEntityName = fieldTypeMeta.name;
    const relatedToEntity = schema.getEntity(relatedEntityName);
    if (!relatedToEntity)
        throw new Error(`Entity ${relatedEntityName} Not Found`);
    const { type, direction, properties, queryDirection, nestedOperations, aggregate } = (0, parse_arguments_1.parseArguments)(directives_1.relationshipDirective, relationshipUsage);
    let attributes = [];
    let propertiesTypeName = undefined;
    if (properties && typeof properties === "string") {
        const propertyInterface = definitionCollection.relationshipProperties.get(properties);
        if (!propertyInterface) {
            throw new Error(`The \`@relationshipProperties\` directive could not be found on the \`${properties}\` interface`);
        }
        propertiesTypeName = properties;
        const inheritedFields = propertyInterface.interfaces?.flatMap((interfaceNamedNode) => {
            const interfaceName = interfaceNamedNode.name.value;
            return definitionCollection.interfaceTypes.get(interfaceName)?.fields || [];
        }) || [];
        const fields = (propertyInterface.fields || []).map((fieldDefinition) => {
            const filteredInheritedFields = inheritedFields?.filter((inheritedField) => inheritedField.name.value === fieldDefinition.name.value);
            const isPrivateAttribute = (0, utils_2.findDirective)(fieldDefinition.directives, directives_1.privateDirective.name);
            const isInheritedPrivateAttribute = filteredInheritedFields?.some((inheritedField) => (0, utils_2.findDirective)(inheritedField.directives, directives_1.privateDirective.name));
            if (isPrivateAttribute || isInheritedPrivateAttribute) {
                return;
            }
            return (0, parse_attribute_1.parseAttribute)(fieldDefinition, filteredInheritedFields, definitionCollection, propertyInterface.fields);
        });
        attributes = (0, utils_1.filterTruthy)(fields);
    }
    const annotations = (0, parse_annotation_1.parseAnnotations)(mergedDirectives);
    const args = (0, parse_attribute_1.parseAttributeArguments)(field.arguments || [], definitionCollection);
    return new Relationship_1.Relationship({
        name: fieldName,
        type: type,
        args,
        attributes,
        source,
        target: relatedToEntity,
        direction: direction,
        isList: Boolean(fieldTypeMeta.array),
        queryDirection: queryDirection,
        nestedOperations: nestedOperations,
        aggregate: aggregate,
        isNullable: !fieldTypeMeta.required,
        description: field.description?.value,
        annotations: annotations,
        propertiesTypeName,
        inheritedFrom,
    });
}
function generateConcreteEntity(definition, definitionCollection) {
    const inheritsFrom = definition.interfaces?.map((interfaceNamedNode) => {
        const interfaceName = interfaceNamedNode.name.value;
        return definitionCollection.interfaceTypes.get(interfaceName);
    });
    const fields = (definition.fields || []).map((fieldDefinition) => {
        const inheritedFields = inheritsFrom?.flatMap((i) => i?.fields || []);
        const inheritedField = inheritedFields?.filter((inheritedField) => inheritedField.name.value === fieldDefinition.name.value);
        // If the attribute is the private directive then
        const isPrivateAttribute = (0, utils_2.findDirective)(fieldDefinition.directives, directives_1.privateDirective.name);
        const isInheritedPrivateAttribute = inheritedField?.some((inheritedField) => (0, utils_2.findDirective)(inheritedField.directives, directives_1.privateDirective.name));
        if (isPrivateAttribute || isInheritedPrivateAttribute) {
            return;
        }
        const isRelationshipAttribute = (0, utils_2.findDirective)(fieldDefinition.directives, directives_1.relationshipDirective.name);
        const isInheritedRelationshipAttribute = inheritedField?.some((inheritedField) => (0, utils_2.findDirective)(inheritedField.directives, directives_1.relationshipDirective.name));
        if (isRelationshipAttribute || isInheritedRelationshipAttribute) {
            return;
        }
        return (0, parse_attribute_1.parseAttribute)(fieldDefinition, inheritedField, definitionCollection, definition.fields);
    });
    const inheritedDirectives = inheritsFrom?.flatMap((i) => i?.directives || []);
    // schema configuration directives are propagated onto concrete entities
    const schemaDirectives = definitionCollection.schemaExtension?.directives?.filter((x) => constants_1.PROPAGATED_DIRECTIVES_FROM_SCHEMA_TO_OBJECT.includes(x.name.value));
    const annotations = createEntityAnnotations((definition.directives || []).concat(inheritedDirectives || []).concat(schemaDirectives || []));
    return new ConcreteEntity_1.ConcreteEntity({
        name: definition.name.value,
        description: definition.description?.value,
        labels: getLabels(definition),
        attributes: (0, utils_1.filterTruthy)(fields),
        annotations,
    });
}
function getLabels(entityDefinition) {
    const nodeDirectiveUsage = (0, utils_2.findDirective)(entityDefinition.directives, directives_1.nodeDirective.name);
    if (nodeDirectiveUsage) {
        const nodeArguments = (0, parse_arguments_1.parseArguments)(directives_1.nodeDirective, nodeDirectiveUsage);
        if (nodeArguments.labels?.length) {
            return nodeArguments.labels;
        }
    }
    return [entityDefinition.name.value];
}
function createEntityAnnotations(directives) {
    const entityAnnotations = [];
    // TODO: I think this is done already with the map change and we do not have repeatable directives
    // We only ever want to create one annotation even when an entity contains several key directives
    const keyDirectives = directives.filter((directive) => directive.name.value === "key");
    if (keyDirectives) {
        entityAnnotations.push((0, key_annotation_1.parseKeyAnnotation)(keyDirectives));
    }
    const annotations = (0, parse_annotation_1.parseAnnotations)(directives);
    return entityAnnotations.concat(annotations);
}
function createSchemaModelAnnotations(directives) {
    const schemaModelAnnotations = [];
    const annotations = (0, parse_annotation_1.parseAnnotations)(directives);
    return schemaModelAnnotations.concat(annotations);
}
function generateOperation(definition, definitionCollection) {
    const attributes = (definition.fields || [])
        .map((fieldDefinition) => (0, parse_attribute_1.parseAttribute)(fieldDefinition, undefined, definitionCollection))
        .filter((attribute) => attribute.annotations.cypher);
    return new Operation_1.Operation({
        name: definition.name.value,
        attributes,
        annotations: createEntityAnnotations(definition.directives || []),
    });
}
//# sourceMappingURL=generate-model.js.map