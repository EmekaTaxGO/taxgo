import React, { Component } from 'react';
import { View, TouchableHighlight, Text, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CardView from 'react-native-cardview';
import { errorColor } from '../theme/Color';

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
                alignItems: 'center',
                borderRadius: 6
            }}>

                <MaterialIcon name={icon} color='white' size={24} />
                <Text style={{ color: 'white' }}>{label}</Text>
            </View>
        </TouchableHighlight>
    }

    render() {
        const { item } = this.props;
        return <CardView
            cardElevation={6}
            cornerRadius={12}
            style={styles.card}>
            <View style={{
                flexDirection: 'row'
            }}>
                <View style={{ flex: 1 }}>
                    {this.hiddenElement('View', 'visibility', errorColor, () => this.props.onViewClick(item))}
                </View>
                {this.hiddenElement('Edit', 'edit', 'blue', () => this.props.onEditClick(item))}
            </View>
        </CardView>
    }
}
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 17,
        marginVertical: 13,
        backgroundColor: 'white'
    }
})
export default SwipeHiddenView;