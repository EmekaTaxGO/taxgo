import React, { Component } from 'react';
import { OutlinedTextField } from 'react-native-material-textfield';
import { colorAccent, colorPrimary } from '../theme/Color';
class AppTextField extends Component {


    render() {
        const { fieldRef } = this.props;
        return (
            <OutlinedTextField
                {...this.props}
                ref={fieldRef}
                tintColor='black'
            />
        )
    }
}
export default AppTextField;