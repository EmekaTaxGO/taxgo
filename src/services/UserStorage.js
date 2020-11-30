import { log } from "../components/Logger"
import { AsyncStorage } from "react-native";

export async function saveToLocal(key, value) {
    try {
        if (key !== null && value !== null) {
            const info = JSON.stringify(value);
            await AsyncStorage.setItem(key, info);
        }
    } catch (err) {
        log('Error in Saving Data:', err);
    }
}



export const AUTH_DATA = 'AUTH_DATA';

export async function getSavedData(key) {
    try {
        const data = await AsyncStorage.getItem(key);
        if (data !== null) {
            return JSON.parse(data);
        }
        return null;
    } catch (err) {
        log('Error in Retrying data:', err);
        return null;
    }
}
export async function clearData(key) {
    try {
        await AsyncStorage.removeItem(key);
    } catch (err) {
        log('Error clearing Data:', err);
    }
}