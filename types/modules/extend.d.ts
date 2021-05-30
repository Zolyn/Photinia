import { Template, TemplateWithExtend, FileMap, StringObj } from './utils';
interface ReturnVal {
    mergedFileMap: FileMap;
    mergedDevDeps: StringObj;
    mergedScripts: StringObj;
}
declare function extension(template: TemplateWithExtend, templateMap: Map<string, Template>): Promise<ReturnVal>;
export { extension as mergeExtend };
//# sourceMappingURL=extend.d.ts.map