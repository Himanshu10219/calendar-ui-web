import { Component, SimpleChanges } from '@angular/core';
import { DataObserverHelper } from '@helper/dataobserver.helper';
import { StorageHelper } from '@helper/storage.helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private dataobserver: DataObserverHelper) { }
  isUserExist = (StorageHelper.getUserID()) == null;
  ngOnInit(): void {
    this.dataobserver.ObsSessionRefresh().subscribe((val) => {
      console.log("ObsSessionRefresh");
      this.isUserExist = StorageHelper.getUserID() == null;
    })
  }
}
