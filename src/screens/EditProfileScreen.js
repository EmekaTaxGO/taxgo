import React, { useEffect, Component } from 'react';
import { View, StyleSheet, Text, AppState, KeyboardAvoidingView, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImageView from '../components/ImageView';
import { TextField } from 'react-native-material-textfield';
import AppButton from '../components/AppButton';
import { RaisedButton, RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
class EditProfileScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            businessName: '',
            phone: '',
            businessType: '',
            businessCategory: '',
            regNumber: '',
            country: '',
            tax: '',
            taxRegNum: ''
        }
    }

    firstNameRef = React.createRef();
    lastNameRef = React.createRef();
    emailRef = React.createRef();
    businessNameRef = React.createRef();
    phoneRef = React.createRef();
    businessTypeRef = React.createRef();
    businessCategoryRef = React.createRef();
    regNumRef = React.createRef();
    countryRef = React.createRef();
    taxRef = React.createRef();

    render() {
        return <KeyboardAvoidingView
            style={{
                flex: 1,
                flexDirection: 'column'
            }
            }>
            <ScrollView style={{ paddingHorizontal: 20 }}>
                <Image
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: 'lightgray',
                        margin: 20,
                        alignSelf: 'center'
                    }}
                    source={require('../assets/product.png')}
                />
                <TextField
                    label='First Name'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.firstNameRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.lastNameRef.current.focus() }} />
                <TextField
                    label='Last Name'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.lastNameRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.emailRef.current.focus() }} />
                <TextField
                    label='Email'
                    keyboardType='email-address'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.emailRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.businessNameRef.current.focus() }} />
                <TextField
                    label='Business Name'
                    keyboardType='name-phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.businessNameRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.phoneRef.current.focus() }} />
                <TextField
                    label='Phone Number'
                    keyboardType='phone-pad'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.phoneRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.businessTypeRef.current.focus() }} />
                <TextField
                    label='Business Type'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.businessTypeRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.businessCategoryRef.current.focus() }} />
                <TextField
                    label='Business Category'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.businessCategoryRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.regNumRef.current.focus() }} />
                <TextField
                    label='Registration Number'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.regNumRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.countryRef.current.focus() }} />
                <TextField
                    label='Country'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='next'
                    // error={this.state.emailError}
                    ref={this.countryRef}
                    lineWidth={1}
                    onSubmitEditing={() => { this.taxRef.current.focus() }} />
                <TextField
                    label='Tax'
                    keyboardType='numbers-and-punctuation'
                    returnKeyType='done'
                    // error={this.state.emailError}
                    ref={this.businessNameRef}
                    lineWidth={1} x
                    onSubmitEditing={() => { }} />
                {/* <AppButton onPress={() => { }}
                    title='Update'
                    style={styles.updateBtn} /> */}
                <RaisedTextButton
                    title='Update'
                    color={colorAccent}
                    titleColor='white'
                    style={styles.updateBtn}
                    onPress={() => { console.log('Raised btn clicked!') }}
                />
            </ScrollView>
        </KeyboardAvoidingView >
    }
}
const styles = StyleSheet.create({
    updateBtn: {
        padding: 26,
        marginVertical: 20
    }
});
export default EditProfileScreen;