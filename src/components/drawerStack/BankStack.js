import React from 'react';
import SingleStack from './SingleStack';
import BankFragment from '../../fragments/BankFragment';

const BankStack = () => {
    return <SingleStack
        name='Bank'
        component={BankFragment}
        title='Bank'
    />
}
export default BankStack;