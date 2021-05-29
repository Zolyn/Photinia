import {Logger, mergeMap, Template, TemplateWithExtend, preProcess, FileMap} from './utils';

async function extension(template: TemplateWithExtend, templateMap: Map<string, Template>) {
    // 解析含有扩展选项的模板历史，防止循环扩展导致的堆栈溢出
    const resolveExtendsHistory: Template[] = [];
    // 解析没有扩展选项的目标历史，防止重复扩展
    const resolveNormalHistory: Template[] = [];

    // 仓库列表，过滤重复的仓库
    const repos: Set<string> = new Set();

    // 嵌套扩展解析函数
    function resolveExtends(templateWithExtend: TemplateWithExtend): Array<FileMap> {
        resolveExtendsHistory.push(templateWithExtend);
        repos.add(templateWithExtend.repo);
        const result: Array<FileMap> = [];

        templateWithExtend.extends.map((val) => {
            const extendTemplate = templateMap.get(val);
            if (!extendTemplate) {
                throw `Could not find template ${val}!`;
            }

            if (extendTemplate.extends) {
                if (resolveExtendsHistory.includes(extendTemplate)) {
                    throw `Template ${val} has circular extends!`;
                }

                result.push(...resolveExtends(extendTemplate as TemplateWithExtend));
            } else {
                if (resolveNormalHistory.includes(extendTemplate)) {
                    throw `Template ${templateWithExtend.name} has duplicate extends!`;
                }

                resolveNormalHistory.push(extendTemplate);
                repos.add(extendTemplate.repo);
                result.push(preProcess(extendTemplate));
            }

            return undefined;
        });

        result.push(preProcess(templateWithExtend));
        return result;
    }

    const fileMapList = resolveExtends(template);
    // 合并文件映射列表
    // BUG: 仓库不同但文件名相同导致合并后被覆盖
    // TODO: 事先对每个模板的文件映射列表进行路径补全
    let mergedFileMap = fileMapList[0];
    fileMapList.shift();
    fileMapList.map((val) => {
        mergedFileMap = mergeMap(mergedFileMap, val);
        return undefined;
    });

    Logger.debug(mergedFileMap);
    Logger.debug(repos);
}

export { extension as mergeExtend };
