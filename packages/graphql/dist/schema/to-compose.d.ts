import type { DirectiveNode, InputValueDefinitionNode } from "graphql";
import type {
    Directive,
    InputTypeComposerFieldConfigMapDefinition,
    ObjectTypeComposerFieldConfigAsObjectDefinition,
} from "graphql-compose";
import type { Argument } from "../schema-model/argument/Argument";
import type { AttributeAdapter } from "../schema-model/attribute/model-adapters/AttributeAdapter";
import type { ConcreteEntityAdapter } from "../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import type { InterfaceEntityAdapter } from "../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { RelationshipAdapter } from "../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { BaseField, InputField } from "../types";
export declare function graphqlInputValueToCompose(args: InputValueDefinitionNode[]): {};
export declare function graphqlArgsToCompose(args: Argument[]): {};
export declare function graphqlDirectivesToCompose(directives: DirectiveNode[]): Directive[];
export declare function objectFieldsToComposeFields(fields: BaseField[]): {
    [k: string]: ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>;
};
export declare function relationshipAdapterToComposeFields(
    objectFields: RelationshipAdapter[],
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>
): Record<string, ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>>;
export declare function attributeAdapterToComposeFields(
    objectFields: AttributeAdapter[],
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>
): Record<string, ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>>;
export declare function objectFieldsToCreateInputFields(fields: BaseField[]): Record<string, InputField>;
export declare function concreteEntityToCreateInputFields(
    objectFields: AttributeAdapter[],
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>
): Record<string, InputField>;
export declare function objectFieldsToSubscriptionsWhereInputFields(
    typeName: string,
    fields: BaseField[]
): Record<string, InputField>;
export declare function attributesToSubscriptionsWhereInputFields(
    entityWithAttributes: ConcreteEntityAdapter | InterfaceEntityAdapter | RelationshipAdapter
): Record<string, InputField>;
export declare function objectFieldsToUpdateInputFields(fields: BaseField[]): Record<string, InputField>;
export declare function concreteEntityToUpdateInputFields(
    objectFields: AttributeAdapter[],
    userDefinedFieldDirectives: Map<string, DirectiveNode[]>,
    additionalFieldsCallbacks?: AdditionalFieldsCallback[]
): InputTypeComposerFieldConfigMapDefinition;
export declare function withMathOperators(): AdditionalFieldsCallback;
export declare function withArrayOperators(): AdditionalFieldsCallback;
type AdditionalFieldsCallback = (
    attribute: AttributeAdapter,
    fieldDefinition: InputField
) => Record<string, InputField> | InputTypeComposerFieldConfigMapDefinition;
export {};
//# sourceMappingURL=to-compose.d.ts.map
