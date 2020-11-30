import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import OnScreenSpinner from '../../components/OnScreenSpinner';


import * as contactActions from '../../redux/actions/contactActions'
import FullScreenError from '../FullScreenError';
import EmptyView from '../EmptyView';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class SupplierTabItem extends Component {

    constructor(props) {
        super(props);
    }

    fetchSupplierList = () => {
        const { contactActions } = this.props;
        contactActions.getSupplierList();
    }

    componentDidMount() {
        this.fetchSupplierList();
    }

    render() {
        const { contact } = this.props;
        if (contact.fetchingSupplierList) {
            return <OnScreenSpinner />
        }
        if (contact.supplierListError) {
            return <FullScreenError tryAgainClick={this.fetchSupplierList} />
        }
        if (contact.supplierList.length === 0) {
            return <EmptyView message='No Supplier found' iconName='location-city' />
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
)(SupplierTabItem);