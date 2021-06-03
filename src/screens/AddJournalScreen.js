import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DATE_FORMAT, H_DATE_FORMAT } from '../constants/appConstant';
import moment from 'moment';
import { colorAccent, snackbarActionColor, colorWhite, errorColor } from '../theme/Color';
import CardView from 'react-native-cardview';
import Snackbar from 'react-native-snackbar';
import AppTextField from '../components/AppTextField';
import AppButton from '../components/AppButton';
import AppDatePicker from '../components/AppDatePicker';
import timeHelper from '../helpers/TimeHelper';
import { get, isEmpty, isNaN, isNumber, isUndefined, sumBy, toNumber } from 'lodash';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { getFieldValue, setFieldValue } from '../helpers/TextFieldHelpers';
import { getApiErrorMsg, showError, showSuccess } from '../helpers/Utils';
import Api from '../services/api';
import Store from '../redux/Store';
import ProgressDialog from '../components/ProgressDialog';
class AddJournalScreen extends Component {

    constructor(props) {
        super(props);
        const journal = get(props, 'route.params.journal', {})
        this.state = {
            date: journal.date || timeHelper.format(moment()),
            columns: journal.columns || this.buildColumns(),
            updating: false,
            totalCredit: journal.total || 0,
            totalDebit: journal.total || 0
        }
    }

    dateRef = React.createRef();
    journalNumRef = React.createRef();
    journalDesRef = React.createRef();
    ledgerIndex = 0;

    buildColumns = () => {
        return [
            this.itemData()
        ]
    }
    itemData = () => {
        return {
            id: undefined,
            laccount: undefined,
            details: undefined,
            debit: '',
            credit: '',
            // includeVat: false,
            // vatrate: undefined,
            ledger: undefined,
            ledgerDetails: undefined,
            debitRef: React.createRef(),
            creditRef: React.createRef()
        }
    }
    onAddClick = () => {
        this.props.navigation.push('AddLedgerScreen');
    }

    componentDidMount() {
        const editMode = this.editMode()
        const prefix = editMode ? 'Edit' : 'Add'
        this.props.navigation.setOptions({
            headerRight: () => {
                return <TouchableOpacity onPress={this.onAddClick} style={styles.rightBtn}>
                    <Icon name='add' size={30} color='white' />
                </TouchableOpacity>
            },
            title: `${prefix} Journal`
        })
        if (editMode) {
            this.fetchJournalDetails()
        }
    }

    fetchJournalDetails = () => {
        this.setState({ updating: true })
        const id = Store.getState().auth.authData.id
        const journalId = get(this.props, 'route.params.journalId')
        Api.get(`/journal/getJournalById/${id}/${journalId}`)
            .then(response => {
                this.processJournalData(response.data)
            })
            .catch(err => {
                console.log('Error fetching Journal Details: ', err);
                const errMsg = getApiErrorMsg(err)
                this.setState({ updating: false }, () => {
                    showError(errMsg)
                })
            })
    }

    processJournalData = response => {
        const data = get(response, 'data', {})
        const columns = response.ledgerData.map(item => {
            item.ledger = item.ledgerDetails
            return item
        })
        this.setState({
            updating: false,
            columns,
            date: timeHelper.format(moment(data.date))
        }, () => {
            this.evaluateTotal();
            setFieldValue(this.journalNumRef, data.reference)
            setFieldValue(this.journalDesRef, data.description)
        })
    }

    onJournalDateChanged = date => {
        this.setState({
            date: date
        });
    }
    evaluateTotal = () => {
        var totalDebit = 0, totalCredit = 0;
        this.state.columns.forEach(item => {
            const credit = toNumber(item.credit)
            const debit = toNumber(item.debit)
            if (!isNaN(credit)) {
                totalCredit += credit
            }
            if (!isNaN(debit)) {
                totalDebit += debit
            }
        })
        this.setState({ totalCredit, totalDebit })
    }

    setText = (ref, value) => {
        const { current: field } = ref;
        field.setValue(value);
    }

    addLedger = () => {
        const newLedgers = [...this.state.columns];
        newLedgers.push(this.itemData());
        this.setState({ columns: newLedgers }, () => {
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
        let newLedgers = [...this.state.columns];
        newLedgers.splice(index, 1)
        this.setState({ columns: newLedgers }, () => {
            Snackbar.show({
                text: 'Ledger Deleted.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: errorColor,
                action: {
                    text: 'OK',
                    textColor: colorWhite,
                    onPress: () => { }
                }
            })
        })
    }

    onLedgerSelected = info => {
        const columns = [...this.state.columns];
        const newItem = {
            ...columns[this.ledgerIndex],
            ledger: { ...info },
            ledgerDetails: { ...info }
        }
        columns.splice(this.ledgerIndex, 1, newItem)
        this.setState({ columns }, () => {
            this.evaluateTotal()
        });
    }

    chooseLedgerClick = (item, index) => {
        this.ledgerIndex = index;
        this.props.navigation.push('MyLedgerScreen', {
            selectLedger: true,
            onLedgerSelected: this.onLedgerSelected.bind(this)
        });

    }

    onDetailsChange = (data, idx) => {
        const newCol = {
            ...this.state.columns[idx],
            details: data
        };
        const columns = [...this.state.columns]
        columns.splice(idx, 1, newCol)
        this.setState({ columns })
    }

    onCreditChange = (text, idx) => {
        const newCol = {
            ...this.state.columns[idx],
            credit: text,
            debit: ''
        };
        const columns = [...this.state.columns]
        columns.splice(idx, 1, newCol)
        setFieldValue(newCol.debitRef, '')
        this.setState({ columns }, () => {
            this.evaluateTotal()
        })
    }
    onDebitChange = (text, idx) => {
        const newCol = {
            ...this.state.columns[idx],
            debit: text,
            credit: ''
        };
        const columns = [...this.state.columns]
        columns.splice(idx, 1, newCol)

        setFieldValue(newCol.creditRef, '')
        this.setState({ columns }, () => {
            this.evaluateTotal()
        })
    }

    getLedgerTitle = item => {
        const ledger = get(item, 'ledger', {})
        return `${ledger.nominalcode}-${ledger.laccount}-${ledger.categorygroup}`
    }

    renderLedgerItem = (item, index) => {
        const isLast = index + 1 === this.state.columns.length;
        const showDeleteBtn = index > 0;
        const ledgerTitle = this.getLedgerTitle(item)

        if (item.creditRef === undefined) {
            item.creditRef = React.createRef()
        }
        if (item.debitRef === undefined) {
            item.debitRef = React.createRef()
        }
        if (item.detailsRef == undefined) {
            item.detailsRef = React.createRef()
        }
        setFieldValue(item.creditRef, item.credit)
        setFieldValue(item.debitRef, item.debit)
        setFieldValue(item.detailsRef, item.details)
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
                            color: item.ledger === undefined ? 'gray' : colorAccent,
                            borderColor: item.ledger === undefined ? 'gray' : colorAccent,
                            borderWidth: 1,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            marginLeft: 12,
                            fontSize: 14
                        }}>{item.ledger === undefined ?
                            'Choose Ledger Account' : ledgerTitle}</Text>
                    </TouchableOpacity>
                </View>
                <AppTextField
                    fieldRef={item.detailsRef}
                    containerStyle={styles.textField}
                    label='Details'
                    keyboardType='default'
                    returnKeyType='done'
                    value={item.details}
                    onChangeText={text => this.onDetailsChange(text, index)} />
                <AppTextField
                    fieldRef={item.debitRef}
                    containerStyle={styles.textField}
                    label='Debit'
                    value={item.debit}
                    keyboardType='default'
                    returnKeyType='done'
                    keyboardType='numeric'
                    onChangeText={text => this.onDebitChange(text, index)} />
                <AppTextField
                    fieldRef={item.creditRef}
                    containerStyle={styles.textField}
                    label='Credit'
                    keyboardType='default'
                    value={item.credit}
                    returnKeyType='done'
                    keyboardType='numeric'
                    onChangeText={text => this.onCreditChange(text, index)} />

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
                            <MaterialCommunityIcons size={34} name='delete-circle' color={errorColor} />
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
                <AppDatePicker
                    date={this.state.date}
                    displayFormat={DATE_FORMAT}
                    containerStyle={styles.textField}
                    textFieldProps={{
                        label: 'Journal Date',
                        fieldRef: this.dateRef
                    }}
                    onChange={this.onJournalDateChanged}
                />
                <AppTextField
                    containerStyle={styles.textField}
                    label='Reference'
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

    validateAndSubmit = () => {
        var message;
        if (isEmpty(getFieldValue(this.journalNumRef))) {
            message = 'Enter Journal Reference'
        }
        else if (isEmpty(getFieldValue(this.journalDesRef))) {
            message = 'Enter Journal description'
        }
        else {
            this.state.columns.forEach((value, index) => {
                if (isEmpty(value.details)) {
                    message = 'Enter details for all the ledgers'
                    return false
                } else if (isNaN(toNumber(value.credit))) {
                    message = 'Enter valid credit for all ledgers'
                    return false
                }
                else if (isNaN(toNumber(value.debit))) {
                    message = 'Enter valid debit for all ledgers'
                    return false
                }
                else if (value.ledger === undefined) {
                    message = 'Select ledger account for all ledgers'
                    return false
                }
            })
        }
        if (message) {
            showError(message)
        } else {
            this.proceedToUpdateLedger()
        }
    }
    editMode = () => {
        const journal = get(this.props, 'route.params.journalId')
        return journal !== undefined
    }

    body = () => {

        const id = Store.getState().auth.authData.id

        const ledgerAllowed = ['category', 'categorygroup', 'nominalcode',
            'laccount', 'id']

        const columnAllowed = ['id', 'laccount', 'details', 'debit', 'credit',
            'includeVat', 'vatrate']

        const newColumns = this.state.columns.map(column => {
            const newColumn = Object.keys(column).filter(key => columnAllowed.includes(key))
                .reduce((obj, key) => {
                    obj[key] = column[key]
                    return obj
                }, {})
            const ledger = Object.keys(column.ledger)
                .filter(key => ledgerAllowed.includes(key))
                .reduce((obj, key) => {
                    obj[key] = column.ledger[key]
                    return obj
                }, {})
            newColumn.ledger = ledger
            newColumn.ledgerDetails = ledger
            return newColumn
        })
        const journalId = get(this.props, 'route.params.journalId')
        const body = {
            date: this.state.date,
            reference: getFieldValue(this.journalNumRef),
            description: getFieldValue(this.journalDesRef),
            total: this.state.totalCredit,
            userid: id,
            adminid: 0,
            userdate: timeHelper.format(moment()),
            type: this.editMode() ? '2' : '1',
            columns: newColumns
        }
        if (journalId) {
            body.id = journalId
        }
        return body
    }
    proceedToUpdateLedger = () => {
        this.setState({ updating: true })
        const body = this.body()
        Api.post('/journal/addUpdateJournal', body)
            .then(response => {
                this.onJournalUpdated(response.data.message)
            })
            .catch(err => {
                console.log('Error Updating Journal: ', err);
                const errMsg = getApiErrorMsg(err)
                this.setState({ updating: false }, () => {
                    showError(errMsg)
                })
            })
    }

    onJournalUpdated = message => {
        this.setState({ updating: false }, () => {
            this.props.navigation.goBack()
            const onUpdated = get(this.props, 'route.params.onJournalUpdated')
            if (onUpdated) {
                onUpdated()
            }
            setTimeout(() => {
                showSuccess(message)
            }, 400)
        })
    }



    render() {

        const { totalCredit, totalDebit, updating } = this.state
        const enableSaveBtn = totalCredit > 0 && totalCredit == totalDebit
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAwareFlatList
                style={{ flex: 1 }}
                data={this.state.columns}
                renderItem={({ item, index }) => this.renderLedgerItem(item, index)}
                keyExtractor={(item, index) => `${index}`}
                ListHeaderComponent={this.renderHeader}
            />
            <AppButton
                disabled={!enableSaveBtn}
                containerStyle={{ marginHorizontal: 16 }}
                title='Save'
                onPress={this.validateAndSubmit} />
            <ProgressDialog visible={updating} />
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