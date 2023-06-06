import { UserGroup } from './usergroup.model';
import { UserModel } from './usermodel';

export interface GroupWithUsersModel {
  userGroup: UserGroup;
  userGroupMappingList: UserGroupMappingList[];
}

export interface UserGroupMappingList {
  id: number;
  groupID: GroupId;
  userID: UserModel;
}

export interface GroupId {
  id: number;
  name: string;
  description: string;
  ccreateBy: UserModel;
}
