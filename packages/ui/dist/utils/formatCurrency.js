export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
}
export function formatNumber(value, options) {
    return new Intl.NumberFormat('en-US', options).format(value);
}
//# sourceMappingURL=formatCurrency.js.map