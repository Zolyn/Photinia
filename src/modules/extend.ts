import { Logger, mergeMap, Template, fileMap, TemplateWithExtend } from './utils';

async function extension(template: TemplateWithExtend, templateMap: Map<string, Template>) {
    // 解析含有扩展选项的模板历史，防止循环扩展导致的堆栈溢出
    const resolveExtendsHistory: Template[] = [];
    // 解析没有扩展选项的目标历史，防止重复扩展
    const resolveNormalHistory: Template[] = [];

    // 嵌套扩展解析函数
    function resolveExtends(templateWithExtend: TemplateWithExtend): Array<fileMap> {
        resolveExtendsHistory.push(templateWithExtend);
        const result: Array<fileMap> = [];

        templateWithExtend.extends.map((val) => {
            const extendTemplate = templateMap.get(val);
            if (!extendTemplate) {
                throw `Could not find template ${val}!`;
            } else if (extendTemplate.extends) {
                if (resolveExtendsHistory.includes(extendTemplate)) {
                    throw `Template ${val} has circular extends!`;
                }

                result.push(...resolveExtends(extendTemplate as TemplateWithExtend));
            } else {
                if (resolveNormalHistory.includes(extendTemplate)) {
                    throw `Template ${templateWithExtend.name} has duplicate extends!`;
                }

                resolveNormalHistory.push(extendTemplate);
                result.push(extendTemplate.fileMap);
            }

            return undefined;
        });

        result.push(templateWithExtend.fileMap);
        return result;
    }
}

export { extension as mergeExtend };
