import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class ApiService {

    //Optional Params
    static addParamsIfNotEmpty(params: any, key: string, value: any): any {
        if (value !== null && value !== undefined && value !== '') {
            params = params.set(key, value);
        }
        return params;
    }

}
