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
        // 解析含有扩展选项的模板历史，防止循环扩展导致的堆栈溢出
        const resolveExtendsHistory = [];
        // 解析没有扩展选项的目标历史，防止重复扩展
        const resolveNormalHistory = [];
        // 嵌套扩展解析函数 - 待测试
        function resolveExtends(templateWithExtend) {
            resolveExtendsHistory.push(templateWithExtend);
            const result = [];
            templateWithExtend.extends.map((val) => {
                const extendTemplate = templateMap.get(val);
                if (!extendTemplate) {
                    throw `Could not find template ${val}!`;
                }
                else if (extendTemplate.extends) {
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
                    result.push(extendTemplate.fileMap);
                }
                return undefined;
            });
            result.push(templateWithExtend.fileMap);
            return result;
        }
    });
}
exports.mergeExtend = extension;
