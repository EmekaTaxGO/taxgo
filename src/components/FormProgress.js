import React from 'react';
import { FlatList, View } from 'react-native';
const FormProgress = props => {

    const stateColor = index => {
        const position = props.currPosition
        if (index <= position) {
            return 'green'
        } else {
            return 'gray'
        }
    }
    const renderItem = ({ item, index }) => {
        const isLast = props.data.length == index + 1
        const pColor = stateColor(index)

        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    backgroundColor: pColor
                }} />
                {!isLast ?
                    <View style={{ flex: 1, backgroundColor: pColor, height: 2 }} />
                    : null}
            </View>
        )
    }
    return (
        <FlatList
            horizontal={true}
            data={props.data}
            keyExtractor={(item, index) => item.name}
            renderItem={renderItem}
        />
    )
}
export default FormProgress;