import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text, Platform, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DATE_FORMAT } from '../constants/appConstant';
import moment from 'moment';
import { RaisedTextButton } from 'react-native-material-buttons';
import { colorAccent, snackbarActionColor, colorWhite } from '../theme/Color';
import CardView from 'react-native-cardview';
import Snackbar from 'react-native-snackbar';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
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
    ledgerIndex = 0;

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

    onLedgerSelected = info => {
        const newLedgers = [...this.state.ledgers];
        const newItem = {
            ...newLedgers[this.ledgerIndex],
            info: info
        }
        newLedgers[this.ledgerIndex] = newItem;
        this.setState({ ledgers: newLedgers });
    }

    chooseLedgerClick = (item, index) => {
        this.ledgerIndex = index;
        this.props.navigation.push('JournalLedgersScreen', {
            onLedgerSelected: this.onLedgerSelected.bind(this)
        });

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
                    alignItems: 'center',
                    paddingHorizontal: 16
                }}>
                    <Text style={{ fontSize: 16, flex: 1 }}>Ledger</Text>
                    <TouchableOpacity onPress={() => this.chooseLedgerClick(item, index)}>
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
                            'Choose Ledger Account' : item.info.title}</Text>
                    </TouchableOpacity>
                </View>
                <AppTextField
                    containerStyle={styles.textField}
                    label='Details'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    fieldRef={item.detailsRef}
                    onSubmitEditing={() => this.focus(this.state.ledgers[index].debitRef)} />
                <AppTextField
                    containerStyle={styles.textField}
                    label='Debit'
                    keyboardType='default'
                    returnKeyType='next'
                    lineWidth={1}
                    fieldRef={item.debitRef}
                    onSubmitEditing={() => this.focus(this.state.ledgers[index].creditRef)} />
                <AppTextField
                    containerStyle={styles.textField}
                    label='Credit'
                    keyboardType='default'
                    returnKeyType={isLast ? 'done' : 'next'}
                    lineWidth={1}
                    fieldRef={item.creditRef}
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

    renderHeader = () => {
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({ showDate: true })}>
                    <AppTextField
                        containerStyle={styles.textField}
                        label='Journal Date'
                        keyboardType='default'
                        returnKeyType='done'
                        lineWidth={1}
                        editable={false}
                        title='*required'
                        fieldRef={this.dateRef} />
                </TouchableOpacity>
                {this.state.showDate ? <DateTimePicker
                    value={this.state.date}
                    mode={'datetime'}
                    display='default'
                    minimumDate={new Date()}
                    onChange={this.onJournalDateChanged}
                /> : null}
                <AppTextField
                    containerStyle={styles.textField}
                    label='Journal Number'
                    keyboardType='numeric'
                    returnKeyType='next'
                    lineWidth={1}
                    title='*required'
                    fieldRef={this.journalNumRef}
                    onSubmitEditing={() => this.focus(this.journalDesRef)} />
                <AppTextField
                    containerStyle={styles.textField}
                    label='Description'
                    keyboardType='default'
                    returnKeyType='done'
                    lineWidth={1}
                    title='*required'
                    fieldRef={this.journalDesRef} />

            </View>
        )
    }

    render() {
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                style={{ flex: 1 }}
                data={this.state.ledgers}
                renderItem={({ item, index }) => this.renderLedgerItem(item, index)}
                keyExtractor={(item, index) => `${index}`}
                ListHeaderComponent={this.renderHeader}
            />
            <AppButton
                containerStyle={{ marginHorizontal: 16 }}
                title='Save'
                onPress={() => console.log('Pressed!')} />
        </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    rightBtn: {
        paddingRight: 12
    },
    materialBtn: {
        padding: 26,
        fontSize: 50
    },
    card: {
        marginHorizontal: 16,
        marginVertical: 12,
        paddingVertical: 24,
        backgroundColor: 'white'
    },
    textField: {
        marginTop: 18,
        marginHorizontal: 16
    }
});
export default AddJournalScreen;