getAccTypeIndex = accType => {
    switch (accType) {
        case 'savings':
            return 1;
        case 'card':
            return 2;
        case 'cash':
            return 3;
        case 'loan':
            return 4;
        case 'other':
            return 5
        default:
            return 0;
    }
}
getAccType = index => {
    switch (index) {
        case 1:
            return 'savings'
        case 2:
            return 'card'
        case 3:
            return 'cash'
        case 4:
            return 'loan'
        case 5:
            return 'other'
        default:
            return 'current'
    }
}
getAccTypeArray = () => {
    return [
        {
            id: '1',
            label: 'Current'
        },
        {
            id: '2',
            label: 'Savings'
        },
        {
            id: '3',
            label: 'Credit Card'
        },
        {
            id: '4',
            label: 'Cash in Hand'
        },
        {
            id: '5',
            label: 'Loan'
        },
        {
            id: '6',
            label: 'Others'
        }
    ]
}
getPaidMethodArray = () => {
    return ['Select Paid Method', 'Cash', 'Current', 'Electronic', 'Credit/Debit Card', 'Paypal']
}
getPaidMethod = (index) => {
    switch (index) {
        case 1:
            return 'cash';
        case 2:
            return 'current';
        case 3:
            return 'other';
        case 4:
            return 'card';
        case 5:
            return 'loan';
        default:
            return '';
    }
}
module.exports = {
    getAccType,
    getAccTypeIndex,
    getAccTypeArray,
    getPaidMethodArray,
    getPaidMethod
}