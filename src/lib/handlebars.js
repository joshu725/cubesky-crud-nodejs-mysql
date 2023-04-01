const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = function (timestamp) {
    return format(timestamp);
};

module.exports = helpers;