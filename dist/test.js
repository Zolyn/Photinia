"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./modules/utils");
const a = {
    a: '1',
    b: '2',
};
const b = {
    a: 'a',
    b: 'b',
};
utils_1.overrideKey(b, a, ['a', 'b']);
utils_1.Logger.debug(a);
