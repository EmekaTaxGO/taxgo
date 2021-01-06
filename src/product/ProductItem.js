import React, { PureComponent, Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ImageView from '../components/ImageView';
class ProductItem extends Component {

    shouldComponentUpdate(newProps, newState) {
        return this.props.item.id !== newProps.item.id;
    }

    render() {
        const { item } = this.props;
        return <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white'
        }}>
            <ImageView
                url={item.image}
                placeholder={require('../assets/product.png')}
                style={styles.image} />
            <View style={{
                flexDirection: 'column',
                flex: 1,
                marginStart: 16,
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                paddingVertical: 16
            }}>
                <Text style={styles.textStyle}>{item.itemtype}</Text>
                <Text style={[styles.textStyle, { marginTop: 4 }]}>Item: {item.icode}</Text>
                <Text style={[styles.textStyle, { marginTop: 4 }]}>Description: {item.idescription}</Text>
            </View>
        </View>
    }
}
const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'lightgray',
        marginStart: 16
    },
    textStyle: {
        color: '#3c3c3c',
        fontSize: 14
    }
})
export default ProductItem;