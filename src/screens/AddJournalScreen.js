import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextField } from 'react-native-material-textfield';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DATE_FORMAT } from '../constants/appConstant';
import moment from 'moment';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent, snackbarActionColor, colorWhite } from '../theme/Color';
import CardView from 'react-native-cardview';
import Snackbar from 'react-native-snackbar';
class AddJournalScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            showDate: false,
            ledgers: this.createLedgers()
        }
    }

    dateRef = React.createRef();
    journalNumRef = React.createRef();
    journalDesRef = React.createRef();

    createLedgers = () => {
        return [{
            info: undefined,
            detailsRef: React.createRef(),
            debitRef: React.createRef(),
            creditRef: React.createRef()
        }]
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

    onJournalDateChanged = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;
        this.setState({
            date: currentDate,
            showDate: false
        }, () => {
            this.setText(this.dateRef, moment(currentDate).format(DATE_FORMAT));
        })
    }

    setText = (ref, value) => {
        const { current: field } = ref;
        field.setValue(value);
    }

    addLedger = () => {
        const newLedgers = [...this.state.ledgers];
        newLedgers.push({
            info: undefined,
            detailsRef: React.createRef(),
            debitRef: React.createRef(),
            creditRef: React.createRef()
        });
        this.setState({ ledgers: newLedgers }, () => {
            Snackbar.show({
                text: 'New Ledger added.',
                duration: Snackbar.LENGTH_LONG,
                action: {
                    text: 'OK',
                    textColor: snackbarActionColor,
                    onPress: () => { }
                }
            })
        });
    }

    deleteLedger = index => {
        let newLedgers = [...this.state.ledgers];
        newLedgers.splice(index, 1)
        this.setState({ ledgers: newLedgers }, () => {
            Snackbar.show({
                text: 'Ledger Deleted.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: 'red',
                action: {
                    text: 'OK',
                    textColor: colorWhite,
                    onPress: () => { }
                }
            })
        })
    }

    renderLedgerItem = (item, index) => {
        const isLast = index + 1 === this.state.ledgers.length;
        const showDeleteBtn = index > 0;
        return <CardView
            cardElevation={4}
            cornerRadius={6}
            style={styles.card}>
            <View style={{ flexDirection: 'column' }}>
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 16, flex: 1 }}>Ledger</Text>
                    <TouchableOpacity onPress={() => { }}>
                        <Text style={{
                            borderRadius: 12,
                            color: item.info === undefined ? 'gray' : colorAccent,
                            borderColor: item.info === undefined ? 'gray' : colorAccent,
                            borderWidth: 1,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            marginLeft: 12,
                            fontSize: 14
                        }}>{item.info === undefined ?
                            'Choose Ledger Account' : 'Ledger'}</Text>
                    </TouchableOpacity>
                </View>
                <TextField
                    label='Details'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    ref={item.detailsRef}
                    onSubmitEditing={() => this.focus(this.state.ledgers[index].debitRef)} />
                <TextField
                    label='Debit'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    ref={item.debitRef}
                    onSubmitEditing={() => this.focus(this.state.ledgers[index].creditRef)} />
                <TextField
                    label='Credit'
                    keyboardType='default'
                    returnKeyType={isLast ? 'done' : 'next'}
                    lineWidth={1}
                    ref={item.creditRef}
                    onSubmitEditing={() => {
                        if (isLast === false) {
                            this.focus(this.state.ledgers[index + 1].detailsRef);
                        }
                    }} />

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}>
                    {
                        isLast ? <TouchableOpacity onPress={this.addLedger} style={{ padding: 6 }}>
                            <Ionicons size={34} name='add-circle' color='green' />
                        </TouchableOpacity> : null
                    }
                    {
                        showDeleteBtn ? <TouchableOpacity onPress={() => this.deleteLedger(index)} style={{ marginLeft: 6, padding: 6 }}>
                            <MaterialCommunityIcons size={34} name='delete-circle' color='red' />
                        </TouchableOpacity> : null
                    }



                </View>
            </View>
        </CardView>
    }
    focus = ref => {
        ref.current.focus();
    }

    render() {
        return <View style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
                <TouchableOpacity onPress={() => this.setState({ showDate: true })}>
                    <TextField
                        label='Journal Date'
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        editable={false}
                        title='*required'
                        ref={this.dateRef} />
                </TouchableOpacity>
                {this.state.showDate ? <DateTimePicker
                    value={this.state.date}
                    mode={'datetime'}
                    display='default'
                    minimumDate={new Date()}
                    onChange={this.onJournalDateChanged}
                /> : null}
                <TextField
                    label='Journal Number'
                    keyboardType='numeric'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    ref={this.journalNumRef} />

            </View>
            <FlatList
                style={{ flex: 1 }}
                data={this.state.ledgers}
                renderItem={({ item, index }) => this.renderLedgerItem(item, index)}
                keyExtractor={(item, index) => `${index}`}
            />
            <RaisedTextButton
                title='Save'
                color={colorAccent}
                titleColor='white'
                style={styles.materialBtn}
                onPress={() => console.log('Pressed!')} />
        </View>
    }
}
const styles = StyleSheet.create({
    rightBtn: {
        padding: 12
    },
    materialBtn: {
        padding: 26,
        marginTop: 30,
        fontSize: 50
    },
    card: {
        marginHorizontal: 16,
        marginTop: 12,
        padding: 12
    }
});
export default AddJournalScreen;