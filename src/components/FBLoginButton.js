import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { showToast, log } from './Logger';
const FBLoginButton = ({ onSuccess, onError }) => {

    const getAccessToken = () => {
        AccessToken.getCurrentAccessToken()
            .then(data => {
                log('FB Access Token', data.accessToken.toString());
                onSuccess(data.accessToken.toString());
            });
    }
    const loginToFB = () => {
        LoginManager.logInWithPermissions(['public_profile', 'email'])
            .then(result => {
                if (result.error || result.isCancelled) {
                    showToast('FB SignIn Failed!')
                    onError();
                } else {
                    log('FB Login Success');
                    getAccessToken();
                }
            })
    }
    return <TouchableOpacity style={{
        flexDirection: 'row',
        backgroundColor: '#1577f2',
        borderRadius: 6,
        paddingHorizontal: 24,
        paddingVertical: 12
    }}
        onPress={loginToFB}>
        <Icon name='facebook' color='white' size={20} />
        <Text style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
            flex: 1,
            textAlign: 'center'
        }}>Log in</Text>
    </TouchableOpacity>
}
export default FBLoginButton;