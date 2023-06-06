import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventAddComponent } from './events/event-add/event-add.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { GroupComponent } from './group/group.component';
import { EventCategoryComponent } from './events/event-category/event-category.component';
import { CalendarComponent } from './calendar/calendar.component';
import { GroupListComponent } from './group-list/group-list.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'event-add', component: EventAddComponent },
  { path: '', component: HomeComponent },
  { path: 'Profile', component: ProfileComponent },
  { path: 'add-group', component: GroupComponent },
  { path: 'Category', component: EventCategoryComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'Group', component: GroupListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
