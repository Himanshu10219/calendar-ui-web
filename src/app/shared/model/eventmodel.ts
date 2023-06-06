export interface EventModel {
  id?: number;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  online: boolean;
  url: string;
  venueName: string;
  availability: boolean;
  hostID: HostId;
  groupid: Groupid;
  eventCatID: EventCatId;
  createdAt: string;
  lastModify: string;
  isDeleted: boolean;
}

export interface HostId {
  id: number;
}

export interface Groupid {
  id: number;
}

export interface EventCatId {
  id: number;
}
