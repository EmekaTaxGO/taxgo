import { isString } from 'lodash';
import moment from 'moment';
import { H_DATE_FORMAT } from '../constants/appConstant';

format = (time, timeFormat = H_DATE_FORMAT) => {
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