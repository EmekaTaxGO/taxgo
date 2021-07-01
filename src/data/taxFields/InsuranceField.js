import InsuranceTextField from "./InsuranceTextField";

const containerStyle = {

}
const field_id = 'insurance_radio'
const field = {
    id: field_id,
    type: 'radio-group',
    title: 'Do you have insurance?',
    groups: [
        {
            id: '1',
            label: 'Yes',
            value: 'yes',
            selected: false
        },
        {
            id: '2',
            label: 'No',
            value: 'no',
            selected: true
        }
    ],
    subFields: [
        {
            dependency_field_id: field_id,
            group_id: '1',
            ...InsuranceTextField
        }
    ]

}
field.groups.forEach(element => {
    element.containerStyle = containerStyle
})
export default field