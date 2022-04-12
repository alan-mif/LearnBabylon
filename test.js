const fs = require('fs');
const axios = require('axios');

axios
    .post('http://nodejs.cn/todos', {
        todo: 'test'
    })
    .then(res => {
        console.log(`状态码: ${res.status}`)
        // console.log(res);
    })
    .catch(error => {
        console.error(error)
    });