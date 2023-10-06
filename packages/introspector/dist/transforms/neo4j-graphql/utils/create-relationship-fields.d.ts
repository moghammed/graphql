import { NodeField } from "../NodeField";
export default function createRelationshipFields(
    fromTypeName: string,
    toTypeName: string,
    relType: string,
    propertiesTypeName?: string,
    sanitizeRelType?: (relType: string) => string
): {
    fromField: NodeField;
    toField: NodeField;
};
//# sourceMappingURL=create-relationship-fields.d.ts.map
