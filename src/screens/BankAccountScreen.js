import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import * as bankActions from '../redux/actions/bankActions';
import { bindActionCreators } from 'redux';


class BankAccountScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    isEditMode = () => {
        const { account } = this.props.route.params;
        return account !== undefined;
    }


    componentDidMount() {

    }

    render() {
        return <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>

                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    }
};
const styles = StyleSheet.create({

});
export default connect(
    state => ({
        bank: state.bank
    }),
    dispatch => ({
        bankActions: bindActionCreators(bankActions, dispatch)
    })
)(BankAccountScreen);