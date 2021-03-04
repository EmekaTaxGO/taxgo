const { isWritePermitted } = require("./PermissionHelper")
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

const convertPDF = async (html, fileName) => {
    const permitted = await isWritePermitted();
    if (!permitted) {
        return;
    }
    const file = await RNHTMLtoPDF.convert({
        html,
        directory: 'Documents',
        fileName
    })
    return file.filePath;
}
const print = async (data, fileName = 'Invoice') => {
    const filePath = await convertPDF(data, fileName);
    await RNPrint.print({ filePath });
}

module.exports = {
    convertPDF,
    print
}