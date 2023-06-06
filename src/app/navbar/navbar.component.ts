import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataObserverHelper } from '@helper/dataobserver.helper';
import { StorageHelper } from '@helper/storage.helper';
import { UserApiService } from '@service/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isUserExist = (StorageHelper.getUserID()) == null;
  userName: any;
  constructor(private userApiService: UserApiService, private router: Router, private dataobserver: DataObserverHelper) { }
  async ngOnInit(): Promise<void> {
    this.dataobserver.ObsSessionRefresh().subscribe((val) => {
      console.log("ObsSessionRefresh");
      this.isUserExist = StorageHelper.getUserID() == null;
    })
    this.userName = (StorageHelper.getUserID() == null);
    if (StorageHelper.getUserID() != null) {
      const user = await this.userApiService.getAllUsersAPI({ userID: StorageHelper.getUserID()! });
      if (user != null) {
        this.userName = (user.data[0]['firstName']).toString().toUpperCase();
      }
    }

  }

  logout() {
    sessionStorage.clear();
    this.isUserExist = (StorageHelper.getUserID()) == null;
    if (StorageHelper.getUserID() == null) {
      this.router.navigate(['']).then(() => {
        window.location.reload();
      });
    }
  }
  navigateTo(name: any) {
    this.router.navigate([name]);
  }
}
