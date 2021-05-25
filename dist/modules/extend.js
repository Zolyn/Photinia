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
        // BUG: 暂不支持嵌套的继承
        let mergeFiles;
        const mergeTemplateList = template.extends;
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
            mergeFiles = utils_1.mergeMap(mergeFiles, templ.fileMap);
            return undefined;
        });
        utils_1.Logger.debug(mergeFiles);
    });
}
exports.mergeExtend = extension;
