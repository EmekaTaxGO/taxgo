import React from 'react';
import SingleStack from './SingleStack';
import ReportFragment from '../../fragments/ReportFragment';

const ReportStack = () => {
    return <SingleStack
        name='Report'
        component={ReportFragment}
        title='Report'
    />
}
export default ReportStack;