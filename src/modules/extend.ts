import {Logger, mergeMap, Template} from './utils';

/*
 模板含有扩展选项才会调用本函数，为避免不必要的类型检查，
 用一个新接口覆盖Template接口
 */
interface TemplateWithExtend extends Template {
    extends: string[];
}

async function extension(template: TemplateWithExtend , templateMap: Map<string, Template>) {
    // BUG: 暂不支持嵌套的扩展
    // let mergeFiles: Template['fileMap'];
    // const mergeTemplateList = template.extends as string[];

    // 解析历史，防止循环扩展导致的堆栈溢出
    const resolveHistory: Template[] = [];

    // 嵌套扩展解析函数 - 待测试
    function resolveExtends(template: TemplateWithExtend) {
        resolveHistory.push(template);
        const result: TemplateWithExtend['fileMap'][] = [];
        template.extends.map(val => {
            const extendTemplate = templateMap.get(val);
            if (!extendTemplate) {
                throw `Could not find template ${val}!`
            } else if (resolveHistory.includes(extendTemplate)) {
                throw `Template ${val} has circular extends!`
            } else if (extendTemplate.extends) {
                result.push(...resolveExtends(extendTemplate as TemplateWithExtend));
            } else {
                result.push(extendTemplate.fileMap);
            }
            return undefined;
        });
        result.push(template.fileMap);
        return result;
    }


    // mergeTemplateList.push(template.name);

    // const firstTemplate = templateMap.get(mergeTemplateList[0]);
    // if (!firstTemplate) {
    //     throw `Could not find template ${mergeTemplateList[0]}`;
    // }
    //
    // mergeTemplateList.shift();
    // mergeFiles = firstTemplate.fileMap;
    //
    // mergeTemplateList.map((val) => {
    //     const templ = templateMap.get(val);
    //     if (!templ) {
    //         throw `Could not find template ${val}`;
    //     }
    //     mergeFiles = mergeMap(mergeFiles, templ.fileMap);
    //     return undefined;
    // });
    //
    // Logger.debug(mergeFiles);
}

export { extension as mergeExtend};
