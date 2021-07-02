import { decimalRegex } from "../../helpers/Utils";

export default {
    id: 'deduction',
    type: 'input',
    label: 'DEDUCTIONS (IN INR)',
    value: '',
    error: 'Please enter your deductions',
    validationRegex: decimalRegex,
    regexError: 'Please enter valid deductions',
    minValue: 0,
    minValueError: 'non-negative deduction value is allowed',
    textStyle: {
        keyboardType: 'numeric',
        returnKeyType: 'done'
    }
}