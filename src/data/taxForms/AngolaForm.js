import AgeField from "../taxFields/AgeField";
import DeductionField from "../taxFields/DeductionField";
import OtherIncomeField from "../taxFields/OtherIncomeField";
import ProfitField from "../taxFields/ProfitField";
import TaxableSalaryField from "../taxFields/TaxableSalaryField";
import TaxYearField from "../taxFields/TaxYearField";
import WorkStatusField from "../taxFields/WorkStatusField";

export default {
    tabs: [
        {
            name: 'Tax',
            fields: [
                { ...TaxYearField }
            ]
        },
        {
            name: 'Income',
            fields: [
                { ...TaxableSalaryField },
                { ...OtherIncomeField }
            ]
        },
        {
            name: 'Other',
            fields: [
                {
                    ...ProfitField
                },
                {
                    type: 'input',
                    label: 'AGRICULTURE INCOME (IN INR)',
                    value: '',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
                },
                { ...DeductionField }
            ]
        }
    ],
    currentTab: 0,
    title: 'Indian Tax Form'
}