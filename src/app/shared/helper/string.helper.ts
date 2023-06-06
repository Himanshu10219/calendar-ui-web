export class StringHelper {
    static convertDateTimeforDB(value: string): string {
        const date = new Date(value);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adding leading zero if needed
        const day = ("0" + date.getDate()).slice(-2); // Adding leading zero if needed
        const hours = ("0" + date.getHours()).slice(-2); // Adding leading zero if needed
        const minutes = ("0" + date.getMinutes()).slice(-2); // Adding leading zero if needed
        const seconds = ("0" + date.getSeconds()).slice(-2); // Adding leading zero if needed
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    static isNullorEmpty(val: string): boolean {
        if (val != null && val != "") {
            return false;
        } else {
            return true;
        }
    }
}