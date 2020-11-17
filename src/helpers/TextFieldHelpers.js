
export const setFieldValue = (ref, value) => {
    const { current: field } = ref;
    field.setValue(value);
}
export const getFieldValue = ref => {
    const { current: field } = ref;
    return field.value();
}