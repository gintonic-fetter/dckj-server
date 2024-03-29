'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    // had enabled by egg
    // static: {
    //   enable: true,
    // }
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    mysql: {
        enable: false,
        package: 'egg-mysql',
    },
    validate: {
        enable: true,
        package: 'egg-validate',
    },
    jwt: {
        enable: true,
        package: 'egg-jwt',
    },
};
