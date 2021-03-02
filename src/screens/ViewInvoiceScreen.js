import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
            <View>

            </View>
        )
    }
};
const styles = StyleSheet.create({
    rightBtn: {
        padding: 12
    }
})
export default ViewInvoiceScreen;