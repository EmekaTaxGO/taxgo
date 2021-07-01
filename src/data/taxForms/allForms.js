import AusTaxForm from "./AusTaxForm"
import FranceTaxForm from "./FranceTaxForm"
import IndianTaxForm from "./IndianTaxForm"
import IrelandTaxForm from "./IrelandTaxForm"
import UKTaxForm from "./UKTaxForm"

const allForms = {}
allForms[1] = AusTaxForm
allForms[2] = IrelandTaxForm
allForms[3] = FranceTaxForm
allForms[4] = UKTaxForm
allForms[7] = IndianTaxForm
export default allForms