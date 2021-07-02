import { decimalRegex } from "../../helpers/Utils";

export default {
    id: 'insurance_text',
    type: 'input',
    label: 'Insurance (In AUD)',
    value: '',
    error: 'Please Enter Insurance amount',
    validationRegex: decimalRegex,
    regexError: 'Please Enter valid Insurance Amount',
    minValue: 1,
    minValueError: 'Insurance amount cannot be less than 1',
    textStyle: {
        keyboardType: 'numeric',
        returnKeyType: 'done'
    }
}