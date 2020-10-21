import React, { useEffect } from 'react';
import { StyleSheet, View, LogBox } from 'react-native';
import CardView from 'react-native-cardview';
import { TextField } from 'react-native-material-textfield';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';

const ChangePasswordScreen = () => {


    const oldPassRef = React.createRef();
    const newPassRef = React.createRef();
    const confirmPassRef = React.createRef();

    useEffect(() => {
        setTimeout(() => {
            oldPassRef.current.focus();
        }, 200)
    }, [])
    LogBox.ignoreAllLogs(true);
    return <View style={{ flex: 1 }}>
        <CardView
            cardElevation={4}
            cornerRadius={6}
            style={styles.card}>
            <View style={{ flexDirection: 'column', padding: 12 }}>
                <TextField
                    label='Old Password'
                    returnKeyType='next'
                    ref={oldPassRef}
                    lineWidth={1}
                    secureTextEntry={true}
                    onSubmitEditing={() => { newPassRef.current.focus() }}
                />
                <TextField
                    label='New Password'
                    returnKeyType='next'
                    ref={newPassRef}
                    lineWidth={1}
                    secureTextEntry={true}
                    onSubmitEditing={() => { confirmPassRef.current.focus() }}
                />
                <TextField
                    label='Confirm Password'
                    returnKeyType='done'
                    ref={confirmPassRef}
                    lineWidth={1}
                    secureTextEntry={true}
                    onSubmitEditing={() => { }}
                />
                <RaisedTextButton
                    title='Update'
                    color={colorAccent}
                    titleColor='white'
                    onPress={() => { }}
                    style={styles.updateBtn} />
            </View>
        </CardView>
    </View>
}
const styles = StyleSheet.create({
    card: {
        margin: 12
    },
    updateBtn: {
        padding: 20,
        marginTop: 30,
        marginBottom: 20
    }
});
export default ChangePasswordScreen;