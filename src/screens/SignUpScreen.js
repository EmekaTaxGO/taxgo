import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colorPrimary } from '../theme/Color';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import * as authActions from '../redux/actions/authActions';

class SignUpScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.fetchRenderInfo();
    }

    fetchRenderInfo = () => {
        const { authActions } = this.props;
        authActions.fetchCountry();
    }

    render() {
        const { auth } = this.props;
        // if(auth.fetch)
        if (auth.fetchingCountries) {
            return <OnScreenSpinner />
        }
        if (auth.fetchCountryError) {
            return <FullScreenError tryAgainClick={this.fetchRenderInfo} />
        }
        return <View>
            <Text>Success</Text>
        </View>
        // return <View style={{ flex: 1, backgroundColor: 'white' }}>
        //     <OnScreenSpinner />
        // </View>
    }
}
const styles = StyleSheet.create({

});
export default connect(
    state => ({
        auth: state.auth
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)(SignUpScreen);