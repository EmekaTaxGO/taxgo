import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
class AddJournalScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onAddClick = () => {
        this.props.navigation.push('AddLedgerScreen');
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick} style={styles.rightBtn}>
                    <Icon name='add' size={30} color='white' />
                </TouchableOpacity>
            }
        })
    }

    render() {
        return <View style={{ flex: 1 }}>

        </View>
    }
}
const styles = StyleSheet.create({
    rightBtn: {
        padding: 12
    }
});
export default AddJournalScreen;