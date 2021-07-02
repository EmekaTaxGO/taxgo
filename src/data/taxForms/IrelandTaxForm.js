import { decimalRegex } from "../../helpers/Utils";
import AgeField from "../taxFields/AgeField";
import PaymentFrequencyField from "../taxFields/PaymentFrequencyField";
import TaxableSalaryField from "../taxFields/TaxableSalaryField";
import TaxYearField from "../taxFields/TaxYearField";

export default {
    tabs: [
        {
            name: 'Tax',
            fields: [
                {
                    ...TaxYearField,
                    label: 'Choose Year'
                },
                {
                    id: 'file_status',
                    type: 'picker',
                    label: 'Filing Status',
                    options: ['Single', 'Married - One Income', 'One Parent Family'],
                    selected: -1,
                    text: 'Select Filing Status',
                    error: 'Please Select Filing Status'
                },
                {
                    ...PaymentFrequencyField,
                    options: ['Weekly', 'Fortnight', 'Monthly', 'Yearly']
                }
            ]
        },
        {
            name: 'Income',
            fields: [
                {
                    ...TaxableSalaryField,
                    label: 'Gross Income (In €)',
                    error: 'Please enter your Gross income',
                    regexError: 'Please enter valid Gross income',
                    minValueError: 'Gross income should be greater than 0'
                }
            ]
        },
        {
            name: 'Other',
            fields: [
                {
                    id: 'other_bik',
                    type: 'input',
                    value: '',
                    validationRegex: decimalRegex,
                    minValue: 1,
                    label: 'Other/BIK (In €)',
                    error: 'Please enter your BIK',
                    regexError: 'Please enter valid BIK',
                    minValueError: 'BIK should be greater than 0',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
                },
                { ...AgeField },
                {
                    id: 'pension_in_%',
                    type: 'input',
                    label: 'Pension (IN %)',
                    value: '',
                    error: 'Please enter pension amount',
                    regexError: 'Please enter valid pension (in %)',
                    minValue: 0,
                    minValueError: 'Pension amount should be non-negative',
                    maxValue: 100,
                    maxValueError: 'Pension (in %) should be less than or equal to 100',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
                },
                {
                    id: 'employed_radio',
                    type: 'radio-group',
                    title: 'Are you Pay Employed?',
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
    title: 'Ireland Tax Form'
}