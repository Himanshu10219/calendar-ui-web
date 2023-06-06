import { Component } from '@angular/core';
import { DataObserverHelper } from '@helper/dataobserver.helper';
import { StorageHelper } from '@helper/storage.helper';
import { StringHelper } from '@helper/string.helper';
import { OneSignal } from 'onesignal-ngx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  profileUrl: string = StorageHelper.getUserProfile();
  userName: string = StorageHelper.getUserName();
  isUserExist = StorageHelper.getUserID() == null;
  constructor(private oneSignal: OneSignal, private dataoberver: DataObserverHelper) {
    this.oneSignal.getUserId().then((val: any) => {
      StorageHelper.setDeviceToken(val);
      console.log('oneSignalToken', val);
    });
  }
  ngOnInit(): void {
    this.dataoberver.ObsSessionRefresh().subscribe((val) => {
      this.profileUrl = StorageHelper.getUserProfile();
      this.userName = StorageHelper.getUserName();
      this.isUserExist = StorageHelper.getUserID() == null;
    })
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
}
