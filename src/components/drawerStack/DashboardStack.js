import React from 'react';
import SingleStack from './SingleStack';
import DashBoard from '../../fragments/Dashboard';

const DashboardStack = () => {
    return <SingleStack name='Home' component={DashBoard} title='Dashboard' />
}
export default DashboardStack;