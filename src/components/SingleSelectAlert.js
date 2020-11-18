import { Platform, ActionSheetIOS, Alert } from "react-native"
import { colorAccent, colorPrimary } from "../theme/Color"
import DialogAndroid from 'react-native-dialogs';

export const showSingleSelectAlert = async (title, items, onSelect) => {
    if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions({
            title: title,
            options: items,
            cancelButtonIndex: 0,
            tintColor: colorAccent
        }, index => {
            if (index > 0) {
                onSelect(index - 1);
            }
        })
    } else {
        let listItems = [];
        items.forEach((value, index) => {
            listItems.push({ label: value, index: index })
        })
        const action = await DialogAndroid.showPicker(title, null, {
            cancelable: true,
            type: 'listPlain',
            items: listItems,
            positiveText: 'cancel',
            positiveColor: colorAccent

        })
        if (action.action === 'actionSelect') {
            onSelect(action.selectedItem.index);
        }

    }
}