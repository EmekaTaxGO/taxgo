export default {
    tabs: [
        {
            name: 'Tax',
            fields: [
                {
                    type: 'picker',
                    label: 'TAX YEAR',
                    options: ['2019', '2018'],
                    selected: -1,
                    text: 'Select Year'
                },
                {
                    type: 'picker',
                    label: 'WORK STATUS',
                    options: ['Employee'],
                    selected: -1,
                    text: 'Select Work Status'
                },
                {
                    type: 'input',
                    label: 'AGE (IN YEARS)',
                    value: '',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
                }
            ]
        },
        {
            name: 'Income',
            fields: [
                {
                    type: 'input',
                    label: 'TAXABLE SALARY (IN INR)',
                    value: '',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
                },
                {
                    type: 'input',
                    label: 'OTHER INCOME (IN INR)',
                    value: '',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
                }
            ]
        },
        {
            name: 'Other',
            fields: [
                {
                    type: 'input',
                    label: 'PROFIT AND GAIN (IN INR)',
                    value: '',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
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
                {
                    type: 'input',
                    label: 'DEDUCTIONS (IN INR)',
                    value: '',
                    textStyle: {
                        keyboardType: 'numeric',
                        returnKeyType: 'done'
                    }
                }
            ]
        }
    ],
    currentTab: 0,
    title: 'Indian Tax Form'
}