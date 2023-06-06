import { Component, Input } from '@angular/core';
import { StorageHelper } from '@helper/storage.helper';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataObserverHelper } from '@helper/dataobserver.helper';
import { StringHelper } from '@helper/string.helper';
@Component({
  selector: 'app-sidenav-bar',
  templateUrl: './sidenav-bar.component.html',
  styleUrls: ['./sidenav-bar.component.css'],
})
export class SidenavBarComponent {
  @Input() profileUrl: string = '';
  @Input() userName: string = '';

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.selectedItem = StringHelper.isNullorEmpty(
      StorageHelper.getSelectedNavbar()
    )
      ? 'calendar'
      : StorageHelper.getSelectedNavbar();
  }

  selectedItem: string = 'calendar';

  selectItem(item: string) {
    this.selectedItem = item;
    StorageHelper.setSelectedNavbar(item);
    if (item != 'Logout') {
      this.router.navigate([item]);
    } else {
      this.logout();
    }
  }

  logout() {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        if (StorageHelper.getUserID() == null) {
          this.router.navigate(['']).then(() => {
            window.location.reload();
          });
        }
      } else {
        this.selectItem('calendar');
      }
    });
  }
  activeButton: string = 'Bootstrap';
}
