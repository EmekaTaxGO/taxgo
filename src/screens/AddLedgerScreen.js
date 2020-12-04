import React, { Component } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Keyboard, SafeAreaView, ScrollView, Alert } from 'react-native';
import { TextField, OutlinedTextField, FilledTextField } from 'react-native-material-textfield';
import { log } from '../components/Logger';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent } from '../theme/Color';
import { setFieldValue, getFieldValue } from '../helpers/TextFieldHelpers';
import { isEmpty, showError } from '../helpers/Utils';
import Store from '../redux/Store';
import ProgressDialog from '../components/ProgressDialog';
import { API_ERROR_MESSAGE } from '../constants/appConstant';
import { connect } from 'react-redux';
import * as ledgerActions from '../redux/actions/ledgerActions';
import { bindActionCreators } from 'redux';


class AddLedgerScreen extends Component {

    // params = {
    //     ledger:{},
    //     onLedgerUpdated
    // }
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
        this.setTitle();

        this.setFieldsValue();
    }

    setFieldsValue = () => {
        const { ledger } = this.props.route.params;
        if (ledger !== null) {
            setFieldValue(this.ledgerAccRef, ledger.laccount);
            setFieldValue(this.categoryRef, ledger.category);
            setFieldValue(this.catGroupRef, ledger.categorygroup);
            setFieldValue(this.codeRef, ledger.nominalcode);
        }
    }

    setTitle = () => {
        const prefix = this.isEditMode() ? 'Edit' : 'Add';
        this.props.navigation.setOptions({ title: `${prefix} Ledger` });
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
            this.updateLedger();
        }
    }

    isEditMode = () => {
        const { ledger } = this.props.route.params;
        return ledger !== null;
    }

    updateLedger = () => {
        const { authData } = Store.getState().auth;
        const oldLedger = this.isEditMode() ? this.props.route.params.ledger : {};
        const body = {
            ...oldLedger,
            laccount: getFieldValue(this.ledgerAccRef),
            category: getFieldValue(this.categoryRef),
            categorygroup: getFieldValue(this.catGroupRef),
            nominalcode: getFieldValue(this.codeRef),
            userid: authData.id,
            type: this.isEditMode() ? 2 : 1,
            adminid: authData.id,
            logintype: 'user'
        };

        this.props.ledgerActions.updateLedger(body,
            this.onLedgerUpdated,
            this.onLedgerUpdateError);
    }

    onLedgerUpdateError = () => {
        setTimeout(() => {
            showError(API_ERROR_MESSAGE);
        }, 200);
    }

    onLedgerUpdated = (message) => {
        Alert.alert('Alert', message, [
            {
                style: 'default',
                text: 'OK',
                onPress: () => {
                    this.props.navigation.goBack();
                    this.props.route.params.onLedgerUpdated();
                }
            }
        ], { cancelable: false })
    }


    render() {
        const { ledger } = this.props;

        return <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='always'
                    style={{ paddingHorizontal: 16 }}>
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
                    <ProgressDialog visible={ledger.updatingLedger} />
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    btn: {
        marginVertical: 20,
        paddingHorizontal: 20,
        paddingVertical: 24
    }
});
export default connect(
    state => ({
        ledger: state.ledger
    }),
    dispatch => ({
        ledgerActions: bindActionCreators(ledgerActions, dispatch)
    })
)(AddLedgerScreen);