import React from 'react';
import SingleStack from './SingleStack';
import LedgerFragment from '../../fragments/LedgerFragment';

const LedgerStack = () => {
    return <SingleStack
        name='Ledger'
        component={LedgerFragment}
        title='Ledger'
    />
}
export default LedgerStack;