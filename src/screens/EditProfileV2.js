import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TabLayout from '../components/materialTabs/TabLayout';
import GeneralTab from '../components/profile/GeneralTab';
import BusinessTab from '../components/profile/BusinessTab';
import AccountingTab from '../components/profile/AccountingTab';
import SecurityTab from '../components/profile/SecurityTab';
import CustomizeTab from '../components/profile/CustomizeTab';
import SubscriptionTab from '../components/profile/SubscriptionTab';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../redux/actions/authActions';
import { get, isArray, isArrayBuffer, isArrayLikeObject, isNull, isString, isUndefined } from 'lodash';
import { Buffer } from 'buffer';
import Api from '../services/api';
import { getApiErrorMsg, showError, showSuccess } from '../helpers/Utils';
import OnScreenSpinner from '../components/OnScreenSpinner';
import FullScreenError from '../components/FullScreenError';
import ProgressDialog from '../components/ProgressDialog';
import { View } from 'react-native';
import { isBuffer } from '../helpers/Utils';

class EditProfileV2 extends Component {

    Tab = createMaterialTopTabNavigator();
    iconSize = 26;

    constructor(props) {
        super(props);
        this.state = {
            profile: this.getProfile(),
            fetching: true,
            error: undefined,
            businesses: [],
            updating: false,
            routeName: this.getInitialRouteName()
        }
    }

    getInitialRouteName = () => {
        const routeName = get(this.props, 'route.params.tab', 'General')
        return routeName;
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.setState({ fetching: true, error: undefined });
        Api.get('/default/getBusinessCategories')
            .then(response => {
                this.setState({
                    fetching: false,
                    businesses: response.data.data
                })
            })
            .catch(err => {
                console.log('Error in fetching data: ', err);
                this.setState({
                    fetching: false,
                    error: getApiErrorMsg(err)
                });
            })
    }

    getProfile = () => {
        var profile = get(this.props.auth, 'profile', {});
        var profile = isNull(profile) ? {} : profile;
        const userid = get(this.props, 'auth.authData.id', -1);
        Object.keys(profile).filter(value => isBuffer(profile[value]))
            .forEach(key => {
                profile[key] = Buffer.from(profile[key]).toString()
            })

        console.log('Profile Info: ', JSON.stringify(profile, null, 2));
        return {
            ...profile,
            userid
        }
    }

    onSubmitForm = newProfile => {
        this.setState({ updating: true });
        Api.post('/user/updateProfile', newProfile)
            .then(response => {
                const { authActions } = this.props;
                authActions.fetchProfileFromRemote();

                this.setState({ updating: false }, () => {
                    this.props.navigation.goBack();
                    setTimeout(() => {
                        showSuccess(response.data.message);
                    }, 400);
                });
            })
            .catch(err => {
                console.log('Error Updating Profile:', err);
                this.setState({ updating: false }, () => {
                    showError('Error in updating profile.');
                })

            })
    }

    onPassChange = body => {
        this.setState({ updating: true });
        Api.post('/user/changePassword', body)
            .then(response => {

                this.setState({ updating: false }, () => {
                    this.props.navigation.goBack();
                    setTimeout(() => {
                        showSuccess(response.data.message);
                    }, 400);
                });
            })
            .catch(err => {
                console.log('Error Updating Password:', err);
                this.setState({ updating: false }, () => {
                    showError('Unable to change pass.');
                })

            })
    }

    render() {
        if (this.state.fetching) {
            return <OnScreenSpinner />
        }
        if (this.state.error) {
            return <FullScreenError tryAgainClick={this.fetchData} />
        }
        const { profile } = this.state;
        return (
            <View style={{ flex: 1 }}>

                <TabLayout tab={this.Tab}
                    initialRouteName={this.state.routeName}>

                    <this.Tab.Screen
                        name='General'
                        options={{
                            tabBarIcon: ({ focused, color }) =>
                                <Icon name='account-circle' size={this.iconSize} color={color} />
                        }}>
                        {props => <GeneralTab
                            profile={profile}
                            onSubmit={this.onSubmitForm}
                            {...props}
                        />}
                    </this.Tab.Screen>

                    <this.Tab.Screen
                        name='Business'
                        options={{
                            tabBarIcon: ({ focused, color }) =>
                                <Icon name='business' size={this.iconSize} color={color} />

                        }}>
                        {props => <BusinessTab
                            profile={profile}
                            onSubmit={this.onSubmitForm}
                            businesses={this.state.businesses}
                            {...props} />}
                    </this.Tab.Screen>

                    <this.Tab.Screen
                        name='Accounting'
                        options={{
                            tabBarIcon: ({ focused, color }) =>
                                <Icon name='menu-book' size={this.iconSize} color={color} />
                        }}>
                        {props => <AccountingTab
                            profile={profile}
                            onSubmit={this.onSubmitForm} />}
                    </this.Tab.Screen>

                    <this.Tab.Screen
                        name='Security'
                        options={{
                            tabBarIcon: ({ focused, color }) =>
                                <Icon name='security' size={this.iconSize} color={color} />
                        }}>
                        {props => <SecurityTab
                            profile={profile}
                            onSubmit={this.onSubmitForm}
                            onPassChange={this.onPassChange} />}
                    </this.Tab.Screen>

                    <this.Tab.Screen
                        name='Customize'
                        options={{
                            tabBarIcon: ({ focused, color }) =>
                                <Icon name='dashboard-customize' size={this.iconSize} color={color} />
                        }}>
                        {props => <CustomizeTab
                            profile={profile}
                            onSubmit={this.onSubmitForm} />}
                    </this.Tab.Screen>

                    <this.Tab.Screen
                        name='Subscription'
                        options={{
                            tabBarIcon: ({ focused, color }) =>
                                <Icon name='subscriptions' size={this.iconSize} color={color} />
                        }}>
                        {props => <SubscriptionTab
                            profile={profile}
                            onSubmit={this.onSubmitForm} />}
                    </this.Tab.Screen>
                </TabLayout>

                <ProgressDialog visible={this.state.updating} />
            </View>)
    }
}
export default connect(
    state => ({
        auth: state.auth
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)(EditProfileV2);