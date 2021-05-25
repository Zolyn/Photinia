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
function extension(template, templateMap) {
    return __awaiter(this, void 0, void 0, function* () {
        // BUG: 暂不支持嵌套的扩展
        // let mergeFiles: Template['fileMap'];
        // const mergeTemplateList = template.extends as string[];
        // 解析历史，防止循环扩展导致的堆栈溢出
        const resolveHistory = [];
        // 嵌套扩展解析函数 - 待测试
        function resolveExtends(template) {
            resolveHistory.push(template);
            const result = [];
            template.extends.map(val => {
                const extendTemplate = templateMap.get(val);
                if (!extendTemplate) {
                    throw `Could not find template ${val}!`;
                }
                else if (resolveHistory.includes(extendTemplate)) {
                    throw `Template ${val} has circular extends!`;
                }
                else if (extendTemplate.extends) {
                    result.push(...resolveExtends(extendTemplate));
                }
                else {
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
    });
}
exports.mergeExtend = extension;
