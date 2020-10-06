import React from 'react';
import SingleStack from './SingleStack';
import HomeFragment from '../../fragments/HomeFragment';

const HomeStack = () => {
    return <SingleStack name='Home' component={HomeFragment} />
}
export default HomeStack;