import React from 'react';
import SingleStack from './SingleStack';
import ContactFragment from '../../fragments/ContactFragment';

const ContactStack = () => {
    return <SingleStack
        name='Contact'
        component={ContactFragment}
        title='Contacts'
    />
}
export default ContactStack;