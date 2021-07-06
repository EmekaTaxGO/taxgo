import DeductionField from "../taxFields/DeductionField";
import TaxableSalaryField from "../taxFields/TaxableSalaryField";
import TaxYearField from "../taxFields/TaxYearField";
import PaymentFrequencyField from '../taxFields/PaymentFrequencyField';
import DatePickerField from "../taxFields/DatePickerField";
import { decimalRegex } from "../../helpers/Utils";

export default {
    tabs: [
        {
            name: 'Tax',
            fields: [
                {
                    id: 'maritial_status',
                    type: 'radio-group',
                    title: 'Maritial Status',
                    groups: [
                        {
                            id: '1',
                            label: 'Single',
                            value: 'single',
                            selected: true
                        },
                        {
                            id: '2',
                            label: 'Married',
                            value: 'married',
                            selected: false
                        }
                    ]
                },
                {
                    id: 'blind',
                    type: 'check-box',
                    title: 'BLIND',
                    checked: false
                },
                {
                    id: 'no-nic',
                    type: 'check-box',
                    title: 'NO NIC\'s',
                    checked: false
                },
                {
                    id: 'loan',
                    type: 'check-box',
                    title: 'STUDENT LOAN',
                    checked: false
                },
                { ...DatePickerField },
                {
                    ...TaxYearField,
                    options: ['2019/2020', '2018/2019', '2017/2018', '2016/2017', '2015/2016']
                },
                {
                    ...PaymentFrequencyField,
                    options: [
                        'Weekly',
                        'Monthly',
                        'Yearly'
                    ]
                }
            ]
        },
        {
            name: 'Income',
            fields: [
                {
                    ...TaxableSalaryField,
                    minValue: 2,
                    label: 'Gross Income (In £)',
                    error: 'Please enter your Gross income',
                    regexError: 'Please enter valid Gross income',
                    minValueError: 'Gross income should be greater than equal to 2'
                }
            ]
        },
        {
            name: 'Other',
            fields: [
                {
                    ...DeductionField,
                    label: 'Allowances/Deductions (£)'
                },
                {
                    id: 'tax_code',
                    type: 'input',
                    label: 'Tax Code (Optional)',
                    value: '',
                    validationRegex: '^[0-9]{1,}$',
                    regexError: 'Please enter valid tax code',
                    minValue: 1,
                    minValueError: 'non-negative tax code value is allowed',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
                },
                {
                    id: 'pension',
                    type: 'input',
                    label: 'Pension Contributions (In £)',
                    value: '',
                    validationRegex: decimalRegex,
                    error: 'Please enter pension contribution',
                    regexError: 'Please enter valid pension contributions',
                    minValue: 1,
                    minValueError: 'pension should be greater than or equal to 1',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
                },
                {
                    id: 'employed_radio',
                    type: 'radio-group',
                    title: 'Are you CIS or Self Employed?',
                    groups: [
                        {
                            id: '1',
                            label: 'Yes',
                            value: 'yes',
                            selected: true
                        },
                        {
                            id: '2',
                            label: 'No',
                            value: 'no',
                            selected: false
                        }
                    ]
                },
                {
                    id: 'childcare_radio',
                    type: 'radio-group',
                    title: 'Do you have Childcare Benefit?',
                    groups: [
                        {
                            id: '1',
                            label: 'Yes',
                            value: 'yes',
                            selected: true
                        },
                        {
                            id: '2',
                            label: 'No',
                            value: 'no',
                            selected: false
                        }
                    ]
                }
            ]
        }
    ],
    currentTab: 0,
    title: 'British Tax Form'
}