
const getSelectedReceipts = receipts => {
    const items = [];
    receipts.forEach((value) => {
        if (value.checked === '1') {
            items.push({
                ...value,
                checked: 1,
                remainout: 0,
                amountpaid: value.rout,
                outstanding: 0
            })
        }
    })
    return items;
}
module.exports = {
    getSelectedReceipts
}