import React from 'react';
import SingleStack from './SingleStack';
import InvoiceFragment from '../../fragments/InvoiceFragment';
const InvoiceStack = () => {


    return <SingleStack name='Invoice' component={InvoiceFragment} title='Invoice' />
}
export default InvoiceStack;