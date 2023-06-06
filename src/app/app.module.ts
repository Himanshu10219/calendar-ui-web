import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AppComponent } from './app.component';
import { EventAddComponent } from './events/event-add/event-add.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {
  SocialAuthService,
  SocialLoginModule,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { ProfileComponent } from './profile/profile.component';
import { CardComponent } from './shared/container/card/card.component';
import { GroupComponent } from './group/group.component';
import { EventCategoryComponent } from './events/event-category/event-category.component';
import { SidenavBarComponent } from './sidenav-bar/sidenav-bar.component';
import { CalendarComponent } from './calendar/calendar.component';
import { GroupListComponent } from './group-list/group-list.component';
@NgModule({
  declarations: [
    AppComponent,
    EventAddComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    ProfileComponent,
    GroupComponent,
    EventCategoryComponent,
    CardComponent,
    SidenavBarComponent,
    CalendarComponent,
    GroupListComponent,
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    GoogleSigninButtonModule,
    SocialLoginModule,
    HttpClientModule,
    NgMultiSelectDropDownModule,
    Ng2SearchPipeModule,
  ],
  providers: [
    SocialAuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1020684760760-1ct59mbknaeen9v1vcu3j6tfojq51kd0.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
