import React, { Component } from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CardView from 'react-native-cardview';

class SwipeHiddenView extends Component {

    shouldComponentUpdate(newProps, nextState) {
        return newProps.item.id !== this.props.item.id;
    }

    hiddenElement = (label, icon, color, onPress) => {
        return <TouchableHighlight onPress={onPress} underlayColor={color}>
            <View style={{
                flexDirection: 'column',
                backgroundColor: color,
                width: 70,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <MaterialIcon name={icon} color='white' size={24} />
                <Text style={{ color: 'white' }}>{label}</Text>
            </View>
        </TouchableHighlight>
    }

    render() {
        const { item } = this.props;
        return <CardView
            cardElevation={12}
            cornerRadius={6}
            style={styles.card}>
            <View style={{
                flexDirection: 'row'
            }}>
                <View style={{ flex: 1 }}>
                    {this.hiddenElement('View', 'visibility', 'red', () => this.props.onViewClick(item))}
                </View>
                {this.hiddenElement('Edit', 'edit', 'blue', () => this.props.onEditClick(item))}
            </View>
        </CardView>
    }
}
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 12
    }
})
export default SwipeHiddenView;