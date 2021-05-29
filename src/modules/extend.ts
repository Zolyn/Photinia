import * as sh from 'shelljs';
import { resolve } from 'path';
import {
    Logger,
    mergeMap,
    Template,
    TemplateWithExtend,
    preProcess,
    FileMap,
    photinia,
    StringObj,
    mergeObj,
} from './utils';

// package.json集合（接口）
interface PackageInfoList {
    depList: Array<StringObj>;
    scriptList: PackageInfoList['depList'];
}

// 返回值类型接口
interface ReturnVal {
    mergedFileMap: FileMap;
    mergedDevDeps: StringObj;
    mergedScripts: StringObj;
}

async function extension(template: TemplateWithExtend, templateMap: Map<string, Template>): Promise<ReturnVal> {
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
    let mergedFileMap = fileMapList[0];
    fileMapList.shift();
    fileMapList.map((val) => {
        mergedFileMap = mergeMap(mergedFileMap, val);
        return undefined;
    });

    Logger.debug(mergedFileMap);
    Logger.debug(repos);

    // package.json集合
    const packageInfoList: PackageInfoList = {
        depList: [],
        scriptList: [],
    };

    // 读取所有package.json的devDependencies和scripts项
    [...repos].map((val) => {
        const result = sh.cat(resolve(`${photinia}/templates`, val, 'package.json'));
        Logger.debug(resolve(`${photinia}/templates`, val, 'package.json'));

        if (result.code) {
            Logger.throw(result.stderr);
        }

        const { devDependencies, scripts } = JSON.parse(result.toString());
        packageInfoList.depList.push(devDependencies);
        packageInfoList.scriptList.push(scripts);
        Logger.debug(packageInfoList);

        return undefined;
    });

    function mergePackageInfo(list: PackageInfoList['depList']): StringObj {
        let result = list[0];
        list.shift();
        list.map((val) => {
            result = mergeObj(result, val);
            return undefined;
        });

        return result;
    }

    const mergedDevDeps = mergePackageInfo(packageInfoList.depList);
    const mergedScripts = mergePackageInfo(packageInfoList.scriptList);
    return { mergedFileMap, mergedDevDeps, mergedScripts };
}

export { extension as mergeExtend };
