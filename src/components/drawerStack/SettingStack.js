import React from 'react';
import SingleStack from './SingleStack';
import ProductFragment from '../../fragments/ProductFragment';
import SettingFragment from '../../fragments/SettingFragment';
const SettingStack = () => {

    return <SingleStack name='Product'
        component={SettingFragment}
        title='Settings' />
}
export default SettingStack;