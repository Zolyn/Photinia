"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeExtend = void 0;
const utils_1 = require("./utils");
function extension(template, templateMap) {
    return __awaiter(this, void 0, void 0, function* () {
        // 解析含有扩展选项的模板历史，防止循环扩展导致的堆栈溢出
        const resolveExtendsHistory = [];
        // 解析没有扩展选项的目标历史，防止重复扩展
        const resolveNormalHistory = [];
        // 仓库列表，过滤重复的仓库
        const repos = new Set();
        // 嵌套扩展解析函数
        function resolveExtends(templateWithExtend) {
            resolveExtendsHistory.push(templateWithExtend);
            repos.add(templateWithExtend.repo);
            const result = [];
            templateWithExtend.extends.map((val) => {
                const extendTemplate = templateMap.get(val);
                if (!extendTemplate) {
                    throw `Could not find template ${val}!`;
                }
                if (extendTemplate.extends) {
                    if (resolveExtendsHistory.includes(extendTemplate)) {
                        throw `Template ${val} has circular extends!`;
                    }
                    result.push(...resolveExtends(extendTemplate));
                }
                else {
                    if (resolveNormalHistory.includes(extendTemplate)) {
                        throw `Template ${templateWithExtend.name} has duplicate extends!`;
                    }
                    resolveNormalHistory.push(extendTemplate);
                    repos.add(extendTemplate.repo);
                    result.push(utils_1.preProcess(extendTemplate));
                }
                return undefined;
            });
            result.push(utils_1.preProcess(templateWithExtend));
            return result;
        }
        const fileMapList = resolveExtends(template);
        // 合并文件映射列表
        // BUG: 仓库不同但文件名相同导致合并后被覆盖
        // TODO: 事先对每个模板的文件映射列表进行路径补全
        let mergedFileMap = fileMapList[0];
        fileMapList.shift();
        fileMapList.map((val) => {
            mergedFileMap = utils_1.mergeMap(mergedFileMap, val);
            return undefined;
        });
        utils_1.Logger.debug(mergedFileMap);
        utils_1.Logger.debug(repos);
    });
}
exports.mergeExtend = extension;
