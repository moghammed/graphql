import type { DocumentNode, FieldDefinitionNode } from "graphql";
import type { ResolveTree } from "graphql-parse-resolve-info";
export declare class CustomResolverAnnotation {
    readonly requires: string | undefined;
    parsedRequires: Record<string, ResolveTree> | undefined;
    constructor({ requires }: { requires: string | undefined });
    parseRequire(document: DocumentNode, objectFields?: ReadonlyArray<FieldDefinitionNode>): void;
}
//# sourceMappingURL=CustomResolverAnnotation.d.ts.map
