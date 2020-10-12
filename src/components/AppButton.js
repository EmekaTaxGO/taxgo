
import React from 'react';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import { StyleSheet } from 'react-native';
const AppButton = props => {

    return <RaisedTextButton
        title='Title'
        color={colorAccent}
        titleColor='white'
        {...props}
        style={styles.button} />
}
const styles = StyleSheet.create({
    button: {
        padding: 26,
        marginTop:30,
        fontSize:50
    }
});
export default AppButton;