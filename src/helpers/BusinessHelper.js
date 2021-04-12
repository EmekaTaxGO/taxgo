
const getBusinessTypes = () => {
    return [
        {
            label: 'Sole Trader/Small Business',
            value: 'trader'
        },
        {
            label: 'Partnership',
            value: 'partnership'
        },
        {
            label: 'Limited Company/LLP',
            value: 'limitcompany'
        }
    ]
}
module.exports = {
    getBusinessTypes
}