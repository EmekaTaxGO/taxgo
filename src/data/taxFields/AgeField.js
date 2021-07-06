export default {
    id: 'age',
    type: 'input',
    label: 'AGE (IN YEARS)',
    value: '',
    error: 'Please Enter your age',
    validationRegex: '^[0-9]{1,3}$',
    regexError: 'Please Enter valid age',
    minValue: 1,
    maxValue: 149,
    minValueError: 'Age should be greater than 0',
    maxValueError: 'Age should be less than 150',
    textStyle: {
        keyboardType: 'numeric',
        returnKeyType: 'done'
    }
}