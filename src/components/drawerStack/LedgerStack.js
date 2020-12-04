import React from 'react';
import SingleStack from './SingleStack';
import LedgerFragment from '../../fragments/LedgerFragment';

const LedgerStack = () => {
    return <SingleStack
        name='Ledger'
        component={LedgerFragment}
        title='My Ledger'
    />
}
export default LedgerStack;