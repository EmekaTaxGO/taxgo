

const pushPaymentScreen = (nav, payload, onSuccess) => {
    nav.push('PaymentScreen', {
        payload,
        onSuccess
    })
}
module.exports = {
    pushPaymentScreen
}