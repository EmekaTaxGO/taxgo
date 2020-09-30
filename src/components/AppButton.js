
import React from 'react';
import { RaisedTextButton } from 'react-native-material-buttons';
const AppButton = props => {

    return <RaisedTextButton
        title='Title'
        color='red'
        {...props} />
}
export default AppButton;