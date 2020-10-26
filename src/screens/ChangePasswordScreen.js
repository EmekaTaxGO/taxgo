import React, { useEffect, Component } from 'react';
import { StyleSheet, View, LogBox } from 'react-native';
import CardView from 'react-native-cardview';
import { TextField } from 'react-native-material-textfield';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';

class ChangePasswordScreen extends Component {


    oldPassRef = React.createRef();
    newPassRef = React.createRef();
    confirmPassRef = React.createRef();

    componentDidMount() {
        LogBox.ignoreAllLogs(true);
        setTimeout(() => {
            this.oldPassRef.current.focus();
        }, 200);
    }

    render() {
        return <View style={{ flex: 1 }}>
            <CardView
                cardElevation={4}
                cornerRadius={6}
                style={styles.card}>
                <View style={{ flexDirection: 'column', padding: 12 }}>
                    <TextField
                        label='Old Password'
                        returnKeyType='next'
                        ref={this.oldPassRef}
                        lineWidth={1}
                        secureTextEntry={true}
                        onSubmitEditing={() => { this.newPassRef.current.focus() }}
                    />
                    <TextField
                        label='New Password'
                        returnKeyType='next'
                        ref={this.newPassRef}
                        lineWidth={1}
                        secureTextEntry={true}
                        onSubmitEditing={() => { this.confirmPassRef.current.focus() }}
                    />
                    <TextField
                        label='Confirm Password'
                        returnKeyType='done'
                        ref={this.confirmPassRef}
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
        </View >
    }
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