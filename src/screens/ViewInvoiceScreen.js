import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppText from '../components/AppText';
import { appFont, appFontBold } from '../helpers/ViewHelper';
import { colorPrimary } from '../theme/Color';

class ViewInvoiceScreen extends Component {



    onMoreClick = () => {

    }
    componentDidMount() {

        const { title } = this.props.route.params;
        this.props.navigation.setOptions({
            title,
            headerRight: () => {
                return (
                    <TouchableOpacity onPress={this.onMoreClick} style={styles.rightBtn}>
                        <Icon name='add' size={30} color='white' />
                    </TouchableOpacity>
                )
            }
        })
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row' }}>
                            <AppText style={styles.invNumLabel}>Invoice No:</AppText>
                            <AppText style={styles.invNumValue}>SCN-38</AppText>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
};
const styles = StyleSheet.create({
    rightBtn: {
        padding: 12
    },
    container: {
        flexDirection: 'column',
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    text: {
        fontSize: 40,
        color: 'black'
    },
    invNumLabel: {
        fontFamily: appFontBold,
        fontSize: 20,
        flex: 1
    },
    invNumValue: {
        fontFamily: appFontBold,
        fontSize: 20,
        borderBottomColor: 'red',
        borderBottomWidth: 2
    }
})
export default ViewInvoiceScreen;