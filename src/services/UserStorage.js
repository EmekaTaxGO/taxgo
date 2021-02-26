import { log } from "../components/Logger"
import AsyncStorage from "@react-native-async-storage/async-storage";

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
export const TAX_LIST = 'TAX_LIST';
export const PROFILE_DATA = 'PROFILE_DATA';
export const BALANCE_SHEET = 'BALANCE_SHEET';
export const PROFIT_LOSS_REPORT = 'PROFIT_LOSS_REPORT';
export const TRIAL_BALANCE_REPORT = 'TRIAL_BALANCE_REPORT';

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
export async function clearAll() {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        log('Error Clearing AsyncStorage', error);
    }
}