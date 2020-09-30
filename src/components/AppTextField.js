
import React from 'react';
import { TextField, OutlinedTextField, FilledTextField } from 'react-native-material-textfield';
import { colorDark, colorAccent, colorPrimary } from '../theme/Color';
const AppTextField = props => {

    return <TextField
        textColor={colorDark}
        fontSize={18}
        labelFontSize={16}
        tintColor={colorAccent}
        errorColor='red'
        baseColor='gray'
        lineWidth={1}
        keyboardType='numbers-and-punctuation'
        labelTextStyle={{}}
        {...props}
    />
};
export default AppTextField;