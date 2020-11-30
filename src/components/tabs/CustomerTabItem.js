import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import OnScreenSpinner from '../../components/OnScreenSpinner';
import FullScreenError from '../../components/FullScreenError';
import EmptyView from '../../components/EmptyView';

import * as contactActions from '../../redux/actions/contactActions';
import { bindActionCreators } from 'redux';

class CustomerTabItem extends Component {

    constructor(props) {
        super(props);
    }

    fetchCustomerList = () => {
        const { contactActions } = this.props;
        contactActions.getCustomerList();
    }

    componentDidMount() {
        this.fetchCustomerList();
    }

    render() {
        const { contact } = this.props;
        if (contact.fetchingCustomerList) {
            return <OnScreenSpinner />
        }
        if (contact.customerListError) {
            return <FullScreenError tryAgainClick={this.fetchCustomerList} />
        }
        if (contact.customerList.length === 0) {
            return <EmptyView message='No Customer found' iconName='hail' />
        }
        return <View></View>
    }
}
const styles = StyleSheet.create({

});
export default connect(
    state => ({
        contact: state.contact
    }),
    dispatch => ({
        contactActions: bindActionCreators(contactActions, dispatch)
    })
)(CustomerTabItem);