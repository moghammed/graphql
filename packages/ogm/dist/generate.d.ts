import type { OGM } from "./index";
export interface IGenerateOptions {
    /**
      File to write types to
  */
    outFile?: string;
    /**
      If specified will return the string contents of file and not write
  */
    noWrite?: boolean;
    /**
      Instance of @neo4j/graphql-ogm
  */
    ogm: OGM;
}
declare function generate(options: IGenerateOptions): Promise<undefined | string>;
export default generate;
//# sourceMappingURL=generate.d.ts.map
