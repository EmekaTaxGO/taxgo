import React from 'react';
import SingleStack from './SingleStack';
import Profile from '../../screens/Profile';
const SettingStack = () => {

    return <SingleStack name='Settings'
        component={Profile}
        title='Settings'
        showHeader={false} />
}
export default SettingStack;