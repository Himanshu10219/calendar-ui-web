import { Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { StringHelper } from '@helper/string.helper';
import { EventCatId, EventModel, Groupid, HostId } from '@model/eventmodel';
import { StorageHelper } from '@helper/storage.helper';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { EventCategoryModel } from '@model/eventcategory.model';
import { UserModel } from '@model/usermodel';
import { UserGroup } from '@model/usergroup.model';
import { GroupId, UserGroupMapping, UserId } from '@model/groupmapping.model';

import { userGroupApiService } from '@service/usergroup.service';
import { eventCategoryApiService } from '@service/eventcategory.service';
import { eventApiService } from '@service/event.service';
import { UserApiService } from '@service/user.service';
import { UserGroupMappingApiService } from '@service/usergroupmapping.service';
@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css'],
})
export class EventAddComponent {
  dropdownList: UserModel[] = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  usersList: UserModel[] = [];
  groupName: string = '';
  groupDescription: string = '';

  showGroupModal: boolean = true;
  userGroup: any;
  eventCategoryList: any;
  title: any = '';
  description: any = '';
  otherCat: any = '';
  online: any = '';
  url: any = '';
  venue: any = '';
  availabilty: any = '';
  hostId: any = '';
  groupID: any = '';
  eventCatID: any = '';
  startdate: any = '';
  enddate: any = '';
  link: any = '';
  showTextBox: boolean = false;
  eemailAddresses: string[] = [];
  @ViewChild('membersInput') membersInput!: ElementRef<HTMLInputElement>;
  constructor(
    private userGroupAPI: userGroupApiService,
    private eventCatAPI: eventCategoryApiService,
    private eventAPI: eventApiService,
    private _location: Location,
    private usersAPI: UserApiService,
    private userGroupMappingApi: UserGroupMappingApiService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.getUserGroups();
    this.getCategory();
    this.getAllUsers();
  }

  async getUserGroups() {
    const userGroup = await this.userGroupAPI.getUserGroupAPI({});
    if (userGroup != null) {
      console.log('userGroup', userGroup);
      this.userGroup = userGroup.data;
    }
  }

  async getCategory() {
    const eventCat = await this.eventCatAPI.geteventCategoryAPI({});
    if (eventCat != null) {
      console.log('eventCat', eventCat);
      this.eventCategoryList = eventCat.data;
    }
  }

  toggleFields(): void {
    const additionalFields = document.getElementById(
      'additionalFields'
    ) as HTMLElement;
    if (
      (document.getElementById('showFieldsSwitch') as HTMLInputElement).checked
    ) {
      additionalFields.style.display = 'block';
      this.online = false;
    } else {
      additionalFields.style.display = 'none';
      this.online = true;
    }
  }

  categoryValueChange($event: any): void {
    this.showTextBox = $event.target.value == 'other';
    this.eventCatID = $event.target.value;
  }

  groupValueChange($event: any): void {
    console.log($event.target.value);

    this.groupID = $event.target.value;
  }

  endDatevalueChange($event: any): void {
    this.enddate = StringHelper.convertDateTimeforDB($event.target.value);
  }
  startDatevalueChange($event: any): void {
    this.startdate = StringHelper.convertDateTimeforDB($event.target.value);
  }

  ToLastPage() {
    this._location.back();
  }

  // Event's related Api calling
  async AddEvent() {
    let curDate = new Date().toISOString().slice(0, 10).toString();
    if (this.showTextBox) {
      console.log('showTextBox true');
      const eventCategory: EventCategoryModel = {
        name: this.otherCat,
        createdAt: curDate,
      };
      const newEvent = await this.eventCatAPI.addEventCategoryAPI(
        eventCategory
      );
      if (newEvent != null) {
        const eventCat = await this.eventCatAPI.geteventCategoryAPI({});
        if (eventCat != null) {
          let eventList: EventCategoryModel[] = eventCat.data;
          let eventCategory = eventList.find(
            (event) => event.name == this.otherCat
          );
          this.eventCatID = eventCategory?.id;
          console.log('this.eventCatID', eventCategory?.id);
          this.createEvent();
        }
      }
    } else {
      this.createEvent();
    }
  }

  async createEvent() {
    let curDate = new Date().toISOString().slice(0, 10).toString();
    const hostID: HostId = {
      id: parseInt(StorageHelper.getUserID() ?? ''),
    };
    const eventCatID: EventCatId = {
      id: parseInt(this.eventCatID),
    };

    const groupid: Groupid = {
      id: parseInt(this.groupID),
    };
    const eventBody: EventModel = {
      title: this.title,
      description: this.description,
      startDateTime: this.startdate,
      endDateTime: this.enddate,
      online: this.online,
      url: this.link,
      venueName: this.venue,
      availability: false,
      hostID: hostID,
      groupid: groupid,
      eventCatID: eventCatID,
      createdAt: curDate,
      lastModify: curDate,
      isDeleted: false,
    };
    console.log(eventBody);
    const newEvent = await this.eventAPI.addEventAPI(eventBody);
    console.log('newEvent', newEvent);
    if (newEvent != null) {
      Swal.fire({
        icon: 'success',
        title: 'Your Event has beed added!',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['']);
        }
      });
    }
  }

  // Modal opening and closing logic
  openModal() {
    const addModal = document.getElementById('exampleModal');
    if (addModal != null) {
      addModal.classList.add('show');
      addModal.style.display = 'block';
    }
  }

  closeModal() {
    const addModal = document.getElementById('exampleModal');
    if (addModal != null) {
      addModal.classList.remove('show');
      addModal.style.display = 'none';
    }
  }

  // User Group Creation
  // Members dropdown logic

  fillDropDownList() {
    this.dropdownList = this.usersList;
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'email',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  onItemSelect(item: any) {
    this.selectedItems.push(item);
  }
  onSelectAll(items: any) {
    console.log(items);
    this.selectedItems = items;
  }

  // Getting all user's list and Showing list of uses except logged user
  async getAllUsers() {
    const allUsers = await this.usersAPI.getAllUsersAPI({});
    const loggedUser = StorageHelper.getUserID();
    console.log(loggedUser);
    if (allUsers != null) {
      console.log('users', allUsers);
      this.usersList = allUsers.data.filter(
        (element: any) => element.id != loggedUser
      );

      this.fillDropDownList();
    }
  }

  async addGroup() {
    console.log('this.selectedItems.length', this.selectedItems.length);
    if (
      this.selectedItems.length > 0 &&
      this.groupName != '' &&
      this.groupDescription != ''
    ) {
      const userGroupBody: UserGroup = {
        name: this.groupName,
        description: this.groupDescription,
        createBy: {
          id: parseInt(StorageHelper.getUserID()),
        },
      };
      const groupResponse = await this.userGroupAPI.addUserGroupAPI(
        userGroupBody
      );
      if (groupResponse?.status) {
        console.log('GroupID', groupResponse?.data.id);
        let groupMappingList: UserGroupMapping[] = [];
        this.selectedItems.forEach((element: any) => {
          const groupID: GroupId = {
            id: groupResponse?.data.id,
          };
          const userID: UserId = {
            id: element.id,
          };
          const userGroupMap: UserGroupMapping = {
            groupID: groupID,
            userID: userID,
          };
          groupMappingList.push(userGroupMap);
        });

        const groupMapResponse = await this.userGroupMappingApi.saveUserToGroup(
          groupMappingList
        );
        if (groupMapResponse?.status) {
          Swal.fire({
            icon: 'success',
            title: 'Your Group is created Successfully !',
            showConfirmButton: true,
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              const addModal = document.getElementById('exampleModal');
              if (addModal != null) {
                addModal.classList.remove('show');
                addModal.style.display = 'none';
              }
              this.getUserGroups();
            }
          });
        }
      } else {
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'You have not selected any Member!',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['event-add']);
        }
      });
    }
  }
}
