import { decimalRegex } from "../../helpers/Utils";

export default {
    type: 'input',
    label: 'OTHER INCOME (IN INR)',
    value: '',
    validationRegex: decimalRegex,
    regexError: 'Please enter valid other income',
    minValue: 1,
    minValueError: 'Other income should be greater than 0',
    textStyle: {
        keyboardType: 'numeric',
        returnKeyType: 'done'
    }
}