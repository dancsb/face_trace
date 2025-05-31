'use strict';

module.exports = function detectFaces(buffer) {
    return new Promise((resolve, reject) => {
        const axios = require('axios');
    
        const base64Image = buffer.toString('base64');
        const payload = { image: base64Image };
    
        axios.post('http://dancs.sch.bme.hu:31112/function/face-counter', payload)
             .then(response => {
                resolve(response.data);
             })
             .catch(error => {
                reject(new Error('Face detection failed: ' + error.message));
             });
    });
}