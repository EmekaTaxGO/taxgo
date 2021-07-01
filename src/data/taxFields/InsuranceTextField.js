export default {
    id: 'insurance_text',
    type: 'input',
    label: 'Insurance (In AUD)',
    value: '',
    error: 'Please Enter Insurance amount',
    validationRegex: /^\d{1,}.{1}\d{1,}$/,
    regexError: 'Please Enter valid Insurance Amount',
    minValue: 1,
    minValueError: 'Insurance amount cannot be less than 1',
    textStyle: {
        keyboardType: 'numeric',
        returnKeyType: 'done'
    }
}