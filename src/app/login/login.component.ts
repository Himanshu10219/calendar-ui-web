import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { UserApiService } from '@service/user.service';
import { UserModel } from '@model/usermodel';
import { StorageHelper } from '@helper/storage.helper';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private readonly authService: SocialAuthService,
    private httpClient: HttpClient,
    private apiService: UserApiService
  ) { }

  ngOnInit() {
    let curDate = new Date().toISOString().slice(0, 10).toString();
    this.authService.authState.subscribe(async (user: any) => {
      this.getAccessToken();
      let newUser: UserModel = {
        firstName: user['firstName'],
        lastName: user['lastName'],
        email: user['email'],
        token: user['id'],
        profileURL: user['photoUrl'],
        password: '',
        mobile: '',
        deviceToken: StorageHelper.getDeviceToken(),
        city: '',
        state: '',
        country: '',
        dob: '',
        createdAt: curDate,
        isDeleted: false,
      };
      StorageHelper.setUserProfile(user['photoUrl']);
      if ((await this.apiService.loginUser(newUser)) != null) {
        this.router.navigate(['']);
      }
    });
  }

  private accessToken = '';
  user: any;
  googleClientId =
    '1020684760760-1ct59mbknaeen9v1vcu3j6tfojq51kd0.apps.googleusercontent.com';

  getAccessToken(): void {
    this.authService
      .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => (this.accessToken = accessToken));
  }
  signOut(): void {
    this.authService.signOut();
  }
}
