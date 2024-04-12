const fs = require('fs');

/**
 * Deletes a file from the server.
 * @param {string} filePath - The path of the file to be deleted.
 * @returns {Promise} A promise that resolves when the file is deleted or rejects if an error occurs.
 */
const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports = { deleteFile };