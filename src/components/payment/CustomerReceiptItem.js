import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { colorAccent } from '../../theme/Color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { isFloat, toFloat } from '../../helpers/Utils';
class CustomerReceiptItem extends Component {


    shouldComponentUpdate(newProps, nextProps) {
        return newProps.item.id !== this.props.item.id
            || newProps.item.checked !== this.props.item.checked;
    }

    formatVal = (val) => {
        let valFloat = toFloat(val)
        if (valFloat < 0) {
            valFloat = -1 * valFloat;
        }
        return toFloat(valFloat.toFixed(2));
    }

    outstanding = () => {
        const outstanding = this.props.item.outstanding;
        return this.formatVal(outstanding);
    }
    amountPaid = () => {
        const amtPaid = this.props.item.amountpaid;
        return this.formatVal(amtPaid);
    }
    total = () => {
        const totalAmount = this.props.item.total;
        return this.formatVal(totalAmount);
    }
    render() {
        const { item, index } = this.props;
        return <View style={{ flexDirection: 'column' }}>
            {index === 0 ? <Text style={{
                fontSize: 15,
                color: 'black',
                backgroundColor: '#f0f0f0',
                textAlign: 'center',
                padding: 12
            }}>
                All Transaction
        </Text> : null}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CheckBox
                    style={{ color: colorAccent, marginLeft: 16 }}
                    value={item.checked === '1'}
                    tintColors={{ true: colorAccent, false: 'gray' }}
                    onValueChange={checked => this.props.onCheckChange(checked, index)} />
                <View style={{
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgray',
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center'
                }}>
                    <View style={{
                        flexDirection: 'column',
                        flex: 1,
                        marginLeft: 12,
                    }}>
                        <Text style={{ color: 'blue', fontSize: 14 }}>Total: {this.total()}</Text>
                        <Text style={{ color: 'red', fontSize: 14, marginTop: 2 }}>Outstanding: {this.outstanding()}</Text>
                        <Text style={{ color: 'black', fontSize: 14, marginTop: 2 }}>Amount Paid: {this.amountPaid()}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.props.onPressVisibility(item)}
                        style={{ padding: 16 }}>
                        <MaterialIcons name='visibility' size={30} color={colorAccent} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    }
}
export default CustomerReceiptItem;