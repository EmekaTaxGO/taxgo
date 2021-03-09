import React, { Component } from 'react';
import { OutlinedTextField } from 'react-native-material-textfield';
import { colorAccent, colorPrimary } from '../theme/Color';
class AppTextField extends Component {


    render() {
        const { fieldRef } = this.props;
        return (
            <OutlinedTextField
                ref={fieldRef}
                tintColor='black'
                baseColor='gray'
                {...this.props}
            />
        )
    }
}
export default AppTextField;