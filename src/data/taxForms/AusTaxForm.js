import AgeField from "../taxFields/AgeField";
import TaxYearField from '../taxFields/TaxYearField';
import WorkStatusField from "../taxFields/WorkStatusField";
import TaxableSalaryField from '../taxFields/TaxableSalaryField';
import ExpenseField from "../taxFields/ExpenseField";
import InsuranceField from "../taxFields/InsuranceField";
import PaymentFrequencyField from '../taxFields/PaymentFrequencyField';
export default {
    tabs: [
        {
            name: 'Tax',
            fields: [
                {
                    ...TaxYearField,
                    options: ['2018-2019', '2017-2018']
                },
                {
                    id: 'resident',
                    type: 'picker',
                    label: 'Resident Status',
                    options: [
                        'Australian Resident',
                        'Foreign Resident',
                        'Working Holiday Maker'
                    ],
                    selected: -1,
                    text: 'Select Resident Status',
                    error: 'Please select resident status'
                },
                {
                    ...WorkStatusField
                },
                { ...PaymentFrequencyField }
            ]
        },
        {
            name: 'Income',
            fields: [
                {
                    ...TaxableSalaryField,
                    label: 'Gross Income (IN AUD)',
                    error: 'Please enter gross income',
                    regexError: 'Please enter valid gross income',
                    minValueError: 'gross income should be greater than 0'
                }
            ]
        },
        {
            name: 'Other',
            fields: [
                {
                    ...ExpenseField,
                    label: 'Total Expense (In AUD)'
                },
                { ...AgeField },
                { ...InsuranceField }
            ]
        }
    ],
    currentTab: 0,
    title: 'Australian Tax Form'
}