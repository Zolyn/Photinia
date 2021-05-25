import {Logger, mergeMap, Template} from './utils';

async function extension(template: Template, templateMap: Map<string, Template>) {
    // BUG: 暂不支持嵌套的继承
    let mergeFiles: Template['fileMap'];
    const mergeTemplateList = template.extends as string[];
    mergeTemplateList.push(template.name);

    const firstTemplate = templateMap.get(mergeTemplateList[0]);
    if (!firstTemplate) {
        throw `Could not find template ${mergeTemplateList[0]}`;
    }

    mergeTemplateList.shift();
    mergeFiles = firstTemplate.fileMap;

    mergeTemplateList.map((val) => {
        const templ = templateMap.get(val);
        if (!templ) {
            throw `Could not find template ${val}`;
        }
        mergeFiles = mergeMap(mergeFiles, templ.fileMap);
        return undefined;
    });

    Logger.debug(mergeFiles);
}

export { extension as mergeExtend };
