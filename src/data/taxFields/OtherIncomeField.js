export default {
    type: 'input',
    label: 'OTHER INCOME (IN INR)',
    value: '',
    validationRegex: /^\d{1,}.{1}\d{1,}$/,
    regexError: 'Please enter valid other income',
    minValue: 1,
    minValueError: 'Other income should be greater than 0',
    textStyle: {
        keyboardType: 'numeric',
        returnKeyType: 'done'
    }
}