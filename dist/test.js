"use strict";
let a = {
    a: '1',
    b: '2',
    c: '3'
};
let b = {
    a: '2',
    b: '3'
};
a = Object.assign(Object.assign({}, a), b);
console.log(a);
