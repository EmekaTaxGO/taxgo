import React from 'react';
import { FlatList, View } from 'react-native';
const FormProgress = props => {

    const stateColor = index => {
        const position = props.currPosition
        if (index <= position) {
            return 'green'
        } else {
            return 'lightgray'
        }
    }
    const stickColor = index => {
        const position = props.currPosition
        if (index < position) {
            return 'green'
        } else {
            return 'lightgray'
        }
    }
    const renderItem = (item, index) => {
        const isLast = props.data.length == index + 1
        const pColor = stateColor(index)

        if (isLast) {
            return <View style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                backgroundColor: pColor
            }}
                key={item.name} />
        }
        return (
            <View style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center'
            }}
                key={item.name}>
                <View style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    backgroundColor: pColor
                }} />
                <View style={{ flex: 1, backgroundColor: stickColor(index), height: 2 }} />
            </View>
        )
    }

    return (
        <View style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 20,
            justifyContent: 'center'
        }}>
            {props.data.map((value, index) => renderItem(value, index))}

        </View>
    )
}
export default FormProgress;