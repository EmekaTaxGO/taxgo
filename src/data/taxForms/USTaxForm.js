import DeductionField from "../taxFields/DeductionField";
import TaxableSalaryField from "../taxFields/TaxableSalaryField";
import TaxYearField from "../taxFields/TaxYearField";
import PaymentFrequencyField from '../taxFields/PaymentFrequencyField';

export default {
    tabs: [
        {
            name: 'Tax',
            fields: [
                {
                    ...TaxYearField,
                    options: ['2019', '2020']
                },
                {
                    id: 'filing_status',
                    type: 'picker',
                    label: 'Filing Status',
                    options: [
                        'Single',
                        'Married Joint',
                        'Married Separately',
                        'Head of Household'
                    ],
                    selected: -1,
                    text: 'Select Filing Status',
                    error: 'Please select Filing Status'
                },
                {
                    ...PaymentFrequencyField,
                    id: 'payment_frequency',
                    options: [
                        'Hourley Wage',
                        'Daily',
                        'Weekly',
                        'Monthly',
                        'Yearly'
                    ],
                    subFields: [
                        {
                            id: 'work_hours',
                            dependency_field_id: 'payment_frequency',
                            group_id: '0',
                            type: 'input',
                            label: 'Working Hours per Week',
                            value: '',
                            textStyle: {
                                keyboardType: 'numeric',
                                returnKeyType: 'done'
                            },
                            error: 'Please enter working hours per week',
                            validationRegex: '^[0-9]{1,3}$',
                            regexError: 'Please enter valid working hours',
                            minValue: 1,
                            minValueError: 'Working hours should be greater than 0',
                            textStyle: {
                                keyboardType: 'numeric',
                                returnKeyType: 'done'
                            }
                        }
                    ],
                    selected: -1
                }
            ]
        },
        {
            name: 'Income',
            fields: [
                {
                    ...TaxableSalaryField,
                    label: 'Gross Income (IN $)',
                    error: 'Please enter your gross income',
                    regexError: 'Please enter valid gross income',
                    minValue: 1,
                    minValueError: 'Gross income should be greater than 0'
                }
            ]
        },
        {
            name: 'Other',
            fields: [
                {
                    ...DeductionField,
                    label: 'Other Deductions (IN $)',
                    error: 'Please enter deductions',
                    regexError: 'Please enter valid deductions',
                    minValue: 1,
                    minValueError: 'Your deductions should be greater than 0'
                },
                {
                    id: 'filing_state',
                    type: 'picker',
                    label: 'Choose Filing State',
                    options: [
                        'Alabama',
                        'Alaska',
                        'Arizona',
                        'Arkansas',
                        'California',
                        'Connecticut',
                        'Delaware',
                        'Discrict of columbia',
                        'Florida',
                        'Georgia',
                        'Hawaii',
                        'Idaho',
                        'Lllinois',
                        'Indiana',
                        'Lowa',
                        'Kansas',
                        'Kentucky',
                        'Louisiana',
                        'Maine',
                        'Maryland',
                        'Massachusetts',
                        'Michigan',
                        'Minnesota',
                        'Mississippi',
                        'Missouri',
                        'Montana',
                        'Nebraska',
                        'Nevada',
                        'New Hampshire',
                        'New Jersey',
                        'New Maxico',
                        'New York',
                        'North Carolina',
                        'North Dakota',
                        'Ohio',
                        'Oklahoma',
                        'Oregon',
                        'Pennsylvania',
                        'Rhode Island',
                        'South Carolina',
                        'South Dakota',
                        'Tennessee',
                        'Texas',
                        'Utah',
                        'Vermont',
                        'Virginia',
                        'Washington',
                        'West Virginia',
                        'Wisconsin',
                        'Wyoming'
                    ],
                    selected: -1,
                    text: 'Select Year',
                    error: 'Please select Tax Year'
                }
            ]
        }
    ],
    currentTab: 0,
    title: 'American Tax Form'
}