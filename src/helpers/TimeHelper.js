const { replace, isString } = require("lodash");
const moment = require("moment");

format = (time, timeFormat) => {
    let momentTime;
    if (isString(time)) {
        if (time.indexOf('T') > -1) {
            momentTime = moment(time).utc();
        } else {
            momentTime = moment(time);
        }
    } else {
        momentTime = moment(time);
    }

    if (momentTime.isValid()) {
        return momentTime.format(timeFormat);
    } else {
        return '-';
    }
}
module.exports = {
    format
}