import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextField, OutlinedTextField, FilledTextField } from 'react-native-material-textfield';
import { log } from '../components/Logger';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';

class AddLedgerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    ledgerAccRef = React.createRef();
    codeRef = React.createRef();
    categoryRef = React.createRef();
    catGroupRef = React.createRef();

    componentDidMount() {

    }

    onCategoryClick = () => {

    }
    render() {
        return <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 16 }}>
                <TextField
                    label='Ledger Account'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    errorColor='green'
                    title='*Required'
                    titleTextStyle={{ color: 'red', textDecorationColor: 'black', textShadowColor: 'black' }}
                    ref={this.ledgerAccRef}
                    onSubmitEditing={() => this.codeRef.current.focus()} />
                <TextField
                    label='Nominal Code'
                    returnKeyType='done'
                    keyboardType='default'
                    lineWidth={1}
                    title='*Required'
                    ref={this.codeRef} />
                <TouchableOpacity onPress={this.onCategoryClick}>
                    <TextField
                        label='Category'
                        returnKeyType='next'
                        keyboardType='default'
                        lineWidth={1}
                        editable={false}
                        ref={this.categoryRef}
                        onSubmitEditing={() => this.catGroupRef.current.focus()} />

                </TouchableOpacity>
                <TextField
                    label='Category Group'
                    keyboardType='default'
                    returnKeyType='done'
                    lineWidth={1}
                    editable={false}
                    ref={this.catGroupRef}
                    onSubmitEditing={() => log('Call Api.')} />

            </View>

        </View>
    }
}
const styles = StyleSheet.create({

});
export default AddLedgerScreen;