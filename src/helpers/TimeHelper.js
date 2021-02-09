const moment = require("moment");

format = (time, timeFormat) => {
    return moment(time).format(timeFormat);
}
module.exports = {
    format
}