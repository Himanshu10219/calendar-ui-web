import { StorageString } from '@enums/storage.enum';

export class StorageHelper {

  static setUserID(val: string) {
    sessionStorage.setItem(StorageString.userID, val);
  }
  static setUserProfile(val: string) {
    sessionStorage.setItem(StorageString.userProfile, val);
  }
  static setDeviceToken(val: string) {
    sessionStorage.setItem(StorageString.deviceToken, val);
  }
  static setUserName(val: string) {
    sessionStorage.setItem(StorageString.userName, val);
  }

  static getUserName(): string {
    return sessionStorage.getItem(StorageString.userName)!;
  }

  static setGoogleToken(val: string) {
    sessionStorage.setItem(StorageString.googleToken, val);
  }
  static setSelectedNavbar(val: string) {
    sessionStorage.setItem(StorageString.selectedNavbar, val);
  }

  static getSelectedNavbar(): string {
    return sessionStorage.getItem(StorageString.selectedNavbar)!;
  }
  static getUserID(): string {
    return sessionStorage.getItem(StorageString.userID)!;
  }
  static getUserProfile(): string {
    return sessionStorage.getItem(StorageString.userProfile)!;
  }
  static getDeviceToken(): string {
    return sessionStorage.getItem(StorageString.deviceToken)!;
  }
  static getGoogleToken(): string {
    return sessionStorage.getItem(StorageString.googleToken)!;
  }
}
