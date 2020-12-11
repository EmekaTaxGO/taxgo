import React from 'react';
import SingleStack from './SingleStack';
import PurchaseInvoiceFragment from '../../fragments/PurchaseInvoiceFragment';
const PurchaseInvoiceStack = () => {


    return <SingleStack
        name='Purchase Invoice'
        component={PurchaseInvoiceFragment}
        title='Purchase Invoice' />
}
export default PurchaseInvoiceStack;