import type { Direction } from "../types";
export default function inferRelationshipFieldName(
    relType: string,
    fromType: string,
    toType: string,
    direction: Direction,
    sanitizeRelType?: (relType: string) => string
): string;
//# sourceMappingURL=generate-relationship-field-name.d.ts.map
