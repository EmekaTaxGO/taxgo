import AgeField from "../taxFields/AgeField";
import PaymentFrequencyField from "../taxFields/PaymentFrequencyField";
import TaxableSalaryField from "../taxFields/TaxableSalaryField";
import TaxYearField from "../taxFields/TaxYearField";
import WorkStatusField from '../taxFields/WorkStatusField';

export default {
    tabs: [
        {
            name: 'Tax',
            fields: [
                {
                    ...TaxYearField
                },
                {
                    id: 'martial_status',
                    type: 'picker',
                    label: 'Maritial Status',
                    options: ['Single', 'Married', 'Living Together/Living in concubinage', 'Disable Person'],
                    selected: -1,
                    text: 'Select Maritial Status',
                    error: 'Please Select Filing Status'
                },
                {
                    ...WorkStatusField,
                    options: ['Manager', 'Non-Manager']
                },
                {
                    ...PaymentFrequencyField,
                    options: [
                        'Hourly',
                        'Daily',
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
                    id: 'dependent',
                    type: 'input',
                    label: 'No of children/dependent',
                    value: '',
                    error: 'Please Enter no of dependent',
                    validationRegex: '^[0-9]{1,3}$',
                    regexError: 'Please Enter valid no of dependent',
                    minValue: 0,
                    maxValue: 149,
                    minValueError: 'dependent no should be non negative',
                    maxValueError: 'dependent no should be less than 150',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
                }
            ]
        }
    ],
    currentTab: 0,
    title: 'France Tax Form'
}