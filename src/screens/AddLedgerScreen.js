import React, { Component } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Keyboard, SafeAreaView, ScrollView } from 'react-native';
import { TextField, OutlinedTextField, FilledTextField } from 'react-native-material-textfield';
import { log } from '../components/Logger';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import { setFieldValue, getFieldValue } from '../helpers/TextFieldHelpers';
import { isEmpty, showError } from '../helpers/Utils';
import Store from '../redux/Store';

class AddLedgerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    ledgerAccRef = React.createRef();
    codeRef = React.createRef();
    categoryRef = React.createRef();
    catGroupRef = React.createRef();

    componentDidMount() {

    }

    onCategoryClick = () => {
        this.props.navigation.push('SelectLedgerScreen', {
            onLedgerCategorySelected: item => {
                setFieldValue(this.categoryRef, item.category);
                setFieldValue(this.catGroupRef, item.categorygroup);
            }
        });
    }

    validateAndCreate = () => {
        Keyboard.dismiss();
        if (isEmpty(getFieldValue(this.ledgerAccRef))) {
            showError('Please enter ledger account.');

        } else if (isEmpty(getFieldValue(this.codeRef))) {
            showError('Please enter nominal code.');

        } else if (isEmpty(getFieldValue(this.categoryRef))) {
            showError('Please choose category.')

        } else {
            this.createLedger();
        }
    }

    isEditMode = () => {
        return false;
    }

    updateLedger = () => {
        // --data-raw '{
        //    "laccount": "Test Account",
        //    "category": "2",
        //    "categorygroup": "assets",
        //    "nominalcode": "3311",
        //    "userid": "1062",
        //    "type": "2",
        //    "adminid": "",
        //    "logintype": "user",
        //    "id": "22033"
        // }'
        const { authData } = Store.getState().auth;
        const body = {
            laccount: getFieldValue(this.ledgerAccRef),
            category: getFieldValue(this.categoryRef),
            categorygroup: getFieldValue(this.catGroupRef),
            nominalcode: getFieldValue(this.codeRef),
            userid: authData.id,
            type: this.isEditMode() ? 2 : 1,
            adminid: authData.id,
            logintype: 'user',
            id: ''
        };
    }
    render() {
        return <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='always'>
                    <View>
                        <View style={{ paddingHorizontal: 16 }}>
                            <TextField
                                label='Ledger Account'
                                keyboardType='default'
                                returnKeyType='next'
                                lineWidth={1}
                                errorColor='green'
                                title='*Required'
                                titleTextStyle={{ color: 'red', textDecorationColor: 'black', textShadowColor: 'black' }}
                                ref={this.ledgerAccRef}
                                onSubmitEditing={() => this.codeRef.current.focus()} />
                            <TextField
                                label='Nominal Code'
                                returnKeyType='done'
                                keyboardType='default'
                                lineWidth={1}
                                title='*Required'
                                ref={this.codeRef} />
                            <TouchableOpacity onPress={this.onCategoryClick}>
                                <TextField
                                    label='Category'
                                    returnKeyType='next'
                                    keyboardType='default'
                                    lineWidth={1}
                                    editable={false}
                                    ref={this.categoryRef}
                                    onSubmitEditing={() => this.catGroupRef.current.focus()} />

                            </TouchableOpacity>
                            <TextField
                                label='Category Group'
                                keyboardType='default'
                                returnKeyType='done'
                                lineWidth={1}
                                editable={false}
                                ref={this.catGroupRef}
                                onSubmitEditing={() => log('Call Api.')} />

                            <RaisedTextButton
                                title='Save'
                                color={colorAccent}
                                titleColor='white'
                                style={styles.btn}
                                onPress={this.validateAndCreate} />

                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    btn: {
        marginVertical: 20,
        padding: 20
    }
});
export default AddLedgerScreen;