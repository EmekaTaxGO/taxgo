import AusTaxForm from "./AusTaxForm"
import FranceTaxForm from "./FranceTaxForm"
import IndianTaxForm from "./IndianTaxForm"
import IrelandTaxForm from "./IrelandTaxForm"

const allForms = {}
allForms[1] = AusTaxForm
allForms[2] = IrelandTaxForm
allForms[3] = FranceTaxForm
allForms[7] = IndianTaxForm
export default allForms