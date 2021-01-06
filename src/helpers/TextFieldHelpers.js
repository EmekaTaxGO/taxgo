
export const setFieldValue = (ref, value) => {
    const { current: field } = ref;
    if (field !== null) {
        field.setValue(value);
    }
}
export const getFieldValue = ref => {
    const { current: field } = ref;
    if (field !== null) {
        return field.value();
    } else {
        return '';
    }

}
export const focusField = ref => {
    const { current: field } = ref;
    if (field !== null) {
        field.focus();
    }
}