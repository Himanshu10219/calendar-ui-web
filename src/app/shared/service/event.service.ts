import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { environment } from '@env/environment';
import { APIOperation } from '@enums/operations.enum';
import { ApiResponse } from '@model/apiresponse';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root',
})
export class eventApiService {
  sourceURL: string = environment.apiBaseUrl + 'event/';
  constructor(private http: HttpClient) {}

  async addEventAPI(body: any) {
    try {
      const response = await this.http
        .post(this.sourceURL + APIOperation.Add, body)
        .pipe(
          catchError((error) => {
            console.error('An error occurred:', error);
            throw error;
          })
        )
        .toPromise();
      const apiResponse = response as ApiResponse;
      return apiResponse;
    } catch (error) {
      console.error('addEventAPI_ERROR', error);
      return null;
    }
  }

  async getEventsAPI({
    eventID = '',
    eventCatID = '',
    online = '',
    hostID = '',
  }: {
    eventID?: string;
    eventCatID?: string;
    online?: string;
    hostID?: string;
  }) {
    try {
      let params = new HttpParams();
      params = ApiService.addParamsIfNotEmpty(params, 'eventID', eventID);
      params = ApiService.addParamsIfNotEmpty(params, 'eventCatID', eventCatID);
      params = ApiService.addParamsIfNotEmpty(params, 'online', online);
      params = ApiService.addParamsIfNotEmpty(params, 'hostID', hostID);
      const options = { params: params };
      const response = await this.http
        .get(this.sourceURL + APIOperation.Get, options)
        .toPromise();
      const apiResponse = response as ApiResponse;
      console.log('getEventsAPI_Response', apiResponse);
      return apiResponse;
    } catch (error) {
      console.error('getEventsAPI_ERROR', error);
      return null;
    }
  }
}
