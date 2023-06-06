import { Component } from '@angular/core';
import { StorageHelper } from '@helper/storage.helper';
import { GroupWithUsersModel } from '@model/groupwithusers.model';
import { userGroupApiService } from '@service/usergroup.service';
import { UserGroupMappingApiService } from '@service/usergroupmapping.service';
import { GroupId, UserGroupMapping, UserId } from '@model/groupmapping.model';
import { UserGroup } from '@model/usergroup.model';
import { UserModel } from '@model/usermodel';
import { Router } from '@angular/router';
import { UserApiService } from '@service/user.service';

import Swal from 'sweetalert2';

interface Group {
  id: number;
  name: string;
  groupId: number;
  createdDate: string;
  showUserList: boolean;
  users: User[];
}

interface User {
  email: string;
  joiningDate: string;
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  dropdownList: UserModel[] = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  usersList: UserModel[] = [];
  groupName: string = '';
  groupDescription: string = '';
  constructor(private userGroupAPI: userGroupApiService,
     private userGroupMapAPI: UserGroupMappingApiService,
    private userGroupMappingApi: UserGroupMappingApiService,
    private router: Router,
    private usersAPI: UserApiService,
  ) { }



  groupWithUsersList: GroupWithUsersModel[] = [];
  allgroupWithUsersList: GroupWithUsersModel[] = [];
  joinedgroupWithUsersList: GroupWithUsersModel[] = [];
  mygroupWithUsersList: GroupWithUsersModel[] = [];
  selectedGroup: number | undefined;
  async ngOnInit(): Promise<void> {
    this.getGroupWithUser();
    this.getUserGroups();
    this.getAllUsers();
  }

  async getUserGroups() {
    const userGroup = await this.userGroupAPI.getUserGroupAPI({});
    if (userGroup != null) {
      console.log('userGroup', userGroup);
      this.usersList = userGroup.data;
    }
  }

  async getGroupWithUser() {
    this.groupWithUsersList = [];
    this.allgroupWithUsersList = [];
    this.mygroupWithUsersList = [];
    this.joinedgroupWithUsersList = [];
    const groupMappingResponse = await this.userGroupAPI.getGroupWithUsersAPI();
    if (groupMappingResponse != null) {
      this.groupWithUsersList = groupMappingResponse.data;
      this.allgroupWithUsersList=this.groupWithUsersList;
      this.groupWithUsersList.forEach((element:GroupWithUsersModel)=>{
          if(element.userGroup.createBy.id==parseInt(StorageHelper.getUserID())){
            this.mygroupWithUsersList.push(element);
          }else{
            this.joinedgroupWithUsersList.push(element);
          }
      })
    }
  }

  async deleteUserFromGroup(mapID: number, name: string) {
    Swal.fire({
      title: "Are you sure you want to remove " + name + " ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const userMapDeleteRes = await this.userGroupMapAPI.deleteMapping(mapID);
        if (userMapDeleteRes?.status) {
          Swal.fire({
            icon: 'success',
            title: name + " has been removed !",
            showConfirmButton: true,
            confirmButtonText: 'OK',
          });
          this.getGroupWithUser();
        }
      }
    });

  }
  toggleUserList(index: number) {
    this.selectedGroup = index == this.selectedGroup ? undefined : index;
  }
  selectedCard: string | null = null;

  handleCardClick(card: string) {
    this.groupWithUsersList = [];
    this.selectedGroup =undefined;
    this.selectedCard = card;
    if(card=="allGroups"){
      this.groupWithUsersList = this.allgroupWithUsersList;
    }
    if(card=="myGroups"){
      this.groupWithUsersList = this.mygroupWithUsersList;
    }
    if(card=="joinGroups"){
      this.groupWithUsersList = this.joinedgroupWithUsersList;
    }
  }
  onItemSelect(item: any) {
    this.selectedItems.push(item);
    console.log("onItemSelect ",this.selectedItems)
  }
  onSelectAll(items: any) {
    console.log(items);
    this.selectedItems = items;
  }

  onUnselect(items: any) {
    this.selectedItems = this.selectedItems.filter((item:any) => item.id !== items.id);
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

  openModal() {
    this.selectedItems = [];
    const addModal = document.getElementById('exampleModal');
    if (addModal != null) {
      addModal.classList.add('show');
      addModal.style.display = 'block';
    }
  }

  closeModal() {
    this.selectedItems = [];
    const addModal = document.getElementById('exampleModal');
    if (addModal != null) {
      addModal.classList.remove('show');
      addModal.style.display = 'none';
    }
  }

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

  getRole(id?:Number):String{
    return id==parseInt( StorageHelper.getUserID())?"Admin":"Member";
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
        const groupID: GroupId = {
          id: groupResponse?.data.id,
        };
        const userID: UserId = {
          id:parseInt(StorageHelper.getUserID()),
        };
        const userGroupMap: UserGroupMapping = {
          groupID: groupID,
          userID: userID,
        };
        groupMappingList.push(userGroupMap);
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
              this.getGroupWithUser();
              this.getUserGroups();
              this.getAllUsers();
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

