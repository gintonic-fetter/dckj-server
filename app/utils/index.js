'use strict';

const getType = obj => {
    return Object.prototype.toString.call(obj);
};

const isRegExp = obj => {
    return getType(obj) === '[object RegExp]';
};

module.exports = {
    getType,
    isRegExp,
};
