import AusTaxForm from "./AusTaxForm"
import FranceTaxForm from "./FranceTaxForm"
import IndianTaxForm from "./IndianTaxForm"
import IrelandTaxForm from "./IrelandTaxForm"
import UKTaxForm from "./UKTaxForm"
import USTaxForm from "./USTaxForm"

const allForms = {}
allForms[1] = AusTaxForm
allForms[2] = IrelandTaxForm
allForms[3] = FranceTaxForm
allForms[4] = UKTaxForm
allForms[5] = USTaxForm
allForms[7] = IndianTaxForm
console.log('All Forms: ', JSON.stringify(allForms, null, 2));
export default allForms