import { decimalRegex } from "../../helpers/Utils";

export default {
    id: 'expense',
    type: 'input',
    label: 'Total Expenses (In AUD)',
    value: '',
    error: 'Please enter your total expenses',
    validationRegex: decimalRegex,
    regexError: 'Please enter valid expenses',
    minValue: 0,
    minValueError: 'expenses cannot be less than 0',
    textStyle: {
        keyboardType: 'numeric',
        returnKeyType: 'done'
    }
}