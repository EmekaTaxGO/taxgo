const { get } = require("lodash");

const sanetizeBalanceSheet = async (data) => {
    return new Promise(resolve => {
        const sheet = [];
        //Assets
        const assetRows = [];
        assetRows.push({
            label: 'Bank Assets',
            total: get(data, 'BankAsset.total', 0),
            data: get(data, 'BankAsset.0', [])
        });
        assetRows.push({
            label: 'Fixed Assets',
            total: get(data, 'fixedAsset.total', 0),
            data: get(data, 'fixedAsset.0', [])
        });
        assetRows.push({
            label: 'Future Assets',
            total: get(data, 'futureAsset.total', 0),
            data: get(data, 'futureAsset.0', [])
        });
        assetRows.push({
            label: 'Current Asset',
            total: get(data, 'currentAsset.total', 0),
            data: get(data, 'currentAsset.0', [])
        });

        sheet.push({
            label: 'ASSETS',
            total: get(data, 'totalAssets', 0),
            rows: assetRows
        });

        //Liability
        const liabilityRows = [];
        liabilityRows.push({
            label: 'Card Liability',
            total: get(data, 'CardLiability.total', 0),
            data: get(data, 'CardLiability.0', [])
        });
        liabilityRows.push({
            label: 'Current Liability',
            total: get(data, 'CurrentLiability.total', 0),
            data: get(data, 'CurrentLiability.0', [])
        });
        liabilityRows.push({
            label: 'Future Liability',
            total: get(data, 'FutureLiability.total', 0),
            data: get(data, 'FutureLiability.0', [])
        });
        sheet.push({
            label: 'LIABILITY',
            total: get(data, 'totalLiability', 0),
            rows: liabilityRows
        });
        //Equity
        const equituRows = [];
        equituRows.push({
            label: 'Equity',
            total: get(data, 'Equality.total', 0),
            data: get(data, 'Equality.0', [])
        });
        sheet.push({
            label: 'EQUITY',
            total: get(data, 'totalEquity', 0),
            rows: equituRows
        });
        resolve(sheet);
    })
}
module.exports = {
    sanetizeBalanceSheet
}