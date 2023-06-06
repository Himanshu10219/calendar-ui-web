import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse } from '@model/apiresponse';
import { APIOperation } from '@enums/operations.enum';
import { catchError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class eventCategoryApiService {
  sourceURL: string = environment.apiBaseUrl + 'eventCategory/';
  constructor(private http: HttpClient) {}

  async geteventCategoryAPI({ eventCatID = '' }: { eventCatID?: string }) {
    try {
      let params = new HttpParams();
      params = ApiService.addParamsIfNotEmpty(params, 'eventCatID', eventCatID);
      const options = { params: params };
      const response = await this.http
        .get(this.sourceURL + APIOperation.Get, options)
        .toPromise();
      const apiResponse = response as ApiResponse;
      return apiResponse;
    } catch (error) {
      console.error('eventCategoryAPI_ERROR', error);
      return null;
    }
  }

  async addEventCategoryAPI(body: any) {
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
      console.error('addEventCategoryAPI_ERROR', error);
      return null;
    }
  }

  async updateEventCategoryAPI(body: any, id: number) {
    try {
      const response = await this.http
        .put(this.sourceURL + APIOperation.Update + '/' + id, body)
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
      console.error('updateEventCategoryAPI_ERROR', error);
      return null;
    }
  }

  async deleteCategory(eventCatID: number) {
    try {
      const response = await this.http
        .delete(this.sourceURL + APIOperation.Delete + '/' + eventCatID)
        .toPromise();
      const apiResponse = response as ApiResponse;
      console.log('deleteCategoryAPI_RESPONSE', apiResponse);
      return apiResponse;
    } catch (error) {
      console.error('deleteCategoryAPI_RESPONSE', error);
      return null;
    }
  }
}
