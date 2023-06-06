import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { UserModel } from '@model/usermodel';
import { APIOperation } from '@enums/operations.enum';
import { ApiResponse } from '@model/apiresponse';
import { ApiService } from './api.service';
import { StorageHelper } from '@helper/storage.helper';
import { DataObserverHelper } from '@helper/dataobserver.helper';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  sourceURL: string = environment.apiBaseUrl + 'user/';
  userID: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private dataobserver: DataObserverHelper
  ) {
    this.userID = '/' + StorageHelper.getUserID();
  }

  async loginUser(body: UserModel) {
    try {
      const user = await this.getAllUsersAPI({ email: body.email });
      if (user?.status) {
        StorageHelper.setUserID(user.data[0]['id']);
        const updateUserResponse = await this.updateUserAPI(body);
        console.log("updateUserResponse", updateUserResponse?.message);
        if (updateUserResponse?.status) {
          if (StorageHelper.getUserID() != null) {
            StorageHelper.setUserName(body.firstName!);
            this.dataobserver.updateEvent(true);
            this.router.navigate(['']);
          }
        }
      } else {
        const newUser = await this.addUserAPI(body);
        console.log('New user',newUser)
        if (newUser != null) {
          const user = await this.getAllUsersAPI({ email: body.email });
          if (user?.status) {
            StorageHelper.setUserID(user.data[0]['id']);
            if (StorageHelper.getUserID() != null) {
              this.dataobserver.updateEvent(true);
              StorageHelper.setUserName(body.firstName!);
              this.dataobserver.updateEvent(true);
              this.router.navigate(['']);
            }
          }
        }
      }
    } catch (error) {
      console.error('loginUserAPI_ERROR', error);
    }
  }

  async addUserAPI(body: UserModel) {
    console.log('Body',body);
    try {
      const response = await this.http
        .post(this.sourceURL + APIOperation.Add, body)
        .toPromise();
      const apiResponse = response as ApiResponse;
      console.log('addUserAPI_RESPONSE', apiResponse);
      return apiResponse;
    } catch (error) {
      console.error('addUserAPI_ERROR', error);
      return null;
    }
  }

  async updateUserAPI(body: UserModel) {
    try {
      this.userID = "/" + StorageHelper.getUserID();
      console.log("UserID", StorageHelper.getUserID());
      const response = await this.http
        .put(this.sourceURL + APIOperation.Update + this.userID, body)
        .toPromise();
      const apiResponse = response as ApiResponse;
      console.log('updateUserAPI_RESPONSE', apiResponse.data[0]);
      return apiResponse;
    } catch (error) {
      console.error('updateUserAPI_ERROR', error);
      return null;
    }
  }

  async getAllUsersAPI({
    userID = '',
    email = '',
  }: {
    userID?: string;
    email?: string;
  }) {
    try {
      let params = new HttpParams();
      params = ApiService.addParamsIfNotEmpty(params, 'userID', userID);
      params = ApiService.addParamsIfNotEmpty(params, 'email', email);
      const options = { params: params };
      const response = await this.http
        .get(this.sourceURL + APIOperation.Get, options)
        .toPromise();
      const apiResponse = response as ApiResponse;
      return apiResponse;
    } catch (error) {
      console.error('getAllUsersAPI_ERROR', error);
      return null;
    }
  }
}
