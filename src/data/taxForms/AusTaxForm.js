export default {
    tabs: [
        {
            name: 'Tax',
            fields: [
                {
                    type: 'picker',
                    label: 'TAX YEAR',
                    options: ['Select Year', '2019', '2018'],
                    selected: 0
                },
                {
                    type: 'picker',
                    label: 'WORK STATUS',
                    options: ['Select Work Status', 'Employee'],
                    selected: 0
                },
                {
                    type: 'input',
                    label: 'AGE (IN YEARS)',
                    value: ''
                }
            ]
        },
        {
            name: 'Income',
            fields: [
                {
                    type: 'input',
                    label: 'TAXABLE SALARY (IN INR)',
                    value: ''
                },
                {
                    type: 'input',
                    label: 'OTHER INCOME (IN INR)',
                    value: ''
                }
            ]
        },
        {
            name: 'Other',
            fields: [
                {
                    type: 'input',
                    label: 'PROFIT AND GAIN (IN INR)',
                    value: ''
                },
                {
                    type: 'input',
                    label: 'AGRICULTURE INCOME (IN INR)',
                    value: ''
                },
                {
                    type: 'input',
                    label: 'DEDUCTIONS (IN INR)',
                    value: ''
                }
            ]
        }
    ],
    currentTab: 0,
    title:'Australian Tax Form'
}