const { get } = require("lodash");

const sanetizeBalanceSheet = async (data) => {
    return new Promise(resolve => {
        const sheet = [];
        //Assets
        const assetRows = [];
        assetRows.push({
            label: 'Bank Assets',
            total: get(data, 'BankAsset.total', 0),
            data: get(data, 'BankAsset.ArrayBank', [])
        });
        assetRows.push({
            label: 'Fixed Assets',
            total: get(data, 'FixedAsset.total', 0),
            data: get(data, 'FixedAsset.ArrayFixed', [])
        });
        assetRows.push({
            label: 'Future Assets',
            total: get(data, 'futureAsset.total', 0),
            data: get(data, 'futureAsset.ArrayFuture', [])
        });
        assetRows.push({
            label: 'Current Asset',
            total: get(data, 'currentAsset.total', 0),
            data: get(data, 'currentAsset.ArrayCurrent', [])
        });

        sheet.push({
            label: 'ASSETS',
            total: get(data, 'extra.totalAssets', 0),
            rows: assetRows
        });

        //Liability
        const liabilityRows = [];
        liabilityRows.push({
            label: 'Card Liability',
            total: get(data, 'CardLiability.total', 0),
            data: get(data, 'CardLiability.ArrayCard', [])
        });
        liabilityRows.push({
            label: 'Current Liability',
            total: get(data, 'CurrentLiability.total', 0),
            data: get(data, 'CurrentLiability.ArrayCurLi', [])
        });
        liabilityRows.push({
            label: 'Future Liability',
            total: get(data, 'FutureLiability.total', 0),
            data: get(data, 'FutureLiability.ArrayFurLi', [])
        });
        sheet.push({
            label: 'LIABILITY',
            total: get(data, 'extra.totalLiability', 0),
            rows: liabilityRows
        });
        //Equity
        const equituRows = [];
        equituRows.push({
            label: 'Equity',
            total: get(data, 'Equality.total', 0),
            data: get(data, 'Equality.ArrayEquality', [])
        });
        sheet.push({
            label: 'EQUITY',
            total: get(data, 'extra.totalEquity', 0),
            rows: equituRows
        });
        resolve(sheet);
    })
}
module.exports = {
    sanetizeBalanceSheet
}