import { decimalRegex } from "../../helpers/Utils";

export default {
    id: 'taxable_salary',
    type: 'input',
    label: 'TAXABLE SALARY (IN INR)',
    value: '',
    error: 'Please enter your taxable Salary',
    validationRegex: decimalRegex,
    regexError: 'Please enter valid taxable salary',
    minValue: 1,
    minValueError: 'Taxable salary should be greater than 0',
    textStyle: {
        keyboardType: 'numeric',
        returnKeyType: 'done'
    }
}