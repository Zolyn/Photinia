import { mergeMap, Template } from './utils';

async function extension(template: Template, templateMap: Map<string, Template>) {
    let mergedFiles: Template['fileMap'];
    const extendTemplates = template.extends as string[];
    extendTemplates.push(template.name);

    const firstExtendTemplate = templateMap.get(extendTemplates[0]);
    if (!firstExtendTemplate) {
        throw `Could not find template ${extendTemplates[0]}`;
    }

    extendTemplates.shift();
    mergedFiles = firstExtendTemplate.fileMap;

    extendTemplates.map((val) => {
        const templ = templateMap.get(val);
        if (!templ) {
            throw `Could not find template ${val}`;
        }
        mergedFiles = mergeMap(mergedFiles, templ.fileMap);
        return undefined;
    });
}

export { extension as mergeExtend };
