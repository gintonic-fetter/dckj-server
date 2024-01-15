'use strict';

module.exports = {
    zip(filename, data) {
        const fs = require('fs');
        const archiver = require('archiver');
        const output = fs.createWriteStream(filename);
        const zipFile = archiver('zip');

        zipFile.on('error', err => {
            throw err;
        });
        if (Array.isArray(data)) {
            data.forEach(item => {
                zipFile.append(item, { name: '' });
            });
            return zipFile.pipe(output);
        }
        return data.pipe(zipFile).pipe(output);
    },

}
;
