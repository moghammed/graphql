import type { FieldDefinitionNode, InputValueDefinitionNode } from "graphql";
import { Argument } from "../argument/Argument";
import { Attribute } from "../attribute/Attribute";
import type { DefinitionCollection } from "./definition-collection";
export declare function parseAttributeArguments(
    fieldArgs: readonly InputValueDefinitionNode[],
    definitionCollection: DefinitionCollection
): Argument[];
export declare function parseAttribute(
    field: FieldDefinitionNode,
    inheritedField: FieldDefinitionNode[] | undefined,
    definitionCollection: DefinitionCollection,
    definitionFields?: ReadonlyArray<FieldDefinitionNode>
): Attribute;
//# sourceMappingURL=parse-attribute.d.ts.map
