import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '@env/environment';
import { APIOperation } from '@enums/operations.enum';
import { ApiResponse } from '@model/apiresponse';
import { UserGroup } from '@model/usergroup.model';
import { StorageHelper } from '@helper/storage.helper';
@Injectable({
  providedIn: 'root',
})
export class userGroupApiService {
  sourceURL: string = environment.apiBaseUrl + 'userGroup/';
  userID: string;
  constructor(private http: HttpClient) {
    this.userID = '/' + StorageHelper.getUserID();
  }

  async getUserGroupAPI({ eventCatID = '' }: { eventCatID?: string }) {
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
      console.error('getUserGroupAPI_ERROR', error);
      return null;
    }
  }

  async addUserGroupAPI(body: UserGroup) {
    try {
      const response = await this.http
        .post(this.sourceURL + APIOperation.Add + this.userID, body)
        .toPromise();
      const apiResponse = response as ApiResponse;
      console.log('addUserAPI_RESPONSE', apiResponse);
      return apiResponse;
    } catch (error) {
      console.error('addUserAPI_ERROR', error);
      return null;
    }
  }

  async getGroupWithUsersAPI() {
    try {
      let params = new HttpParams();
      const response = await this.http
        .get(this.sourceURL + APIOperation.GetGroupWithUsers)
        .toPromise();
      const apiResponse = response as ApiResponse;
      return apiResponse;
    } catch (error) {
      console.error('getUserGroupAPI_ERROR', error);
      return null;
    }
  }
}
