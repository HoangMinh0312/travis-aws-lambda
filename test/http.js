const axios = require('axios');

function all() {
    return axios.get('/users.json').then(resp => resp.data);
}

module.exports = {all};