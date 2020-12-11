import React from 'react';
import SingleStack from './SingleStack';
import SalesInvoiceFragment from '../../fragments/SalesInvoiceFragment';
const SalesInvoiceStack = () => {


    return <SingleStack
        name='Sales Invoice'
        component={SalesInvoiceFragment}
        title='Sales Invoice' />
}
export default SalesInvoiceStack;