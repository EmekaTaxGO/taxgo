import React from 'react';
import SingleStack from './SingleStack';
import JournalFragment from '../../fragments/JournalFragment';

const JournalStack = () => {
    return <SingleStack
        name='Contact'
        component={JournalFragment}
        title='Journals'
    />
}
export default JournalStack;