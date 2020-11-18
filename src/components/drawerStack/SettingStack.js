import React from 'react';
import SingleStack from './SingleStack';
import SettingFragment from '../../fragments/SettingFragment';
const SettingStack = () => {

    return <SingleStack name='Settings'
        component={SettingFragment}
        title='Settings' />
}
export default SettingStack;