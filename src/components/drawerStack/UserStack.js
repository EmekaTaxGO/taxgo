import React from 'react';
import SingleStack from './SingleStack';
import UserFragment from '../../fragments/UserFragment';

const UserStack = () => {
    return <SingleStack
        name='User'
        component={UserFragment}
        title='Users/Employees'
    />
}
export default UserStack;