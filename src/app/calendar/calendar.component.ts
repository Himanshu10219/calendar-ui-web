import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarEventModel } from '@model/calendarevent';
import { eventApiService } from '@service/event.service';
import { Router } from '@angular/router';
import { StorageHelper } from '@helper/storage.helper';
import { eventCategoryApiService } from '@service/eventcategory.service';
import { EventCategoryModel } from '@model/eventcategory.model';
import { EventModel } from '@model/eventmodel';

@Component({
  selector: 'app-sidenav',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  todayEventsList: CalendarEventModel[] = [];
  eventListResponse: EventModel[] = [];
  sideClickedEvent: CalendarEventModel | null = null;
  clickedEventDetails: CalendarEventModel | null = null;
  calendarList: CalendarEventModel[] = [];
  profileUrl: string = StorageHelper.getUserProfile();
  userName: string = StorageHelper.getUserName();
  eventCategoryList: any;
  categoryTypes: string = '';
  selectedCategories: string[] = [];
  eventCategory: EventCategoryModel | any = null;
  constructor(
    private router: Router,
    private eventAPI: eventApiService,
    private eventCatAPI: eventCategoryApiService
  ) {}
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: this.calendarList,
    editable: true,
    selectable: true,
    //eventOverlap: false,
    themeSystem: 'bootstrap',
    eventColor: 'var(--appbg)',
    eventClick: this.showEventCard.bind(this),
  };
  async ngOnChanges(): Promise<void> {
    this.loadEvents();
  }

  ngOnInit(): void {
    this.loadEvents();
    this.getCategory();
  }
  async loadEvents() {
    const eventResponse = await this.eventAPI.getEventsAPI({});
    if (eventResponse != null) {
      this.eventListResponse = eventResponse.data;
      this.calendarList = [];
      //Fiting data into particular
      eventResponse.data.forEach(async (item: any) => {
        let newCal: CalendarEventModel = {
          id: item['id'],
          title: item['title'],
          start: item['startDateTime'],
          end: item['endDateTime'],
          description: item['description'],
        };
        this.calendarList.push(newCal);
      });
      // Filter for today's date
      const currentDay = new Date().toISOString().split('T')[0];

      this.todayEventsList = this.calendarList.filter((event) =>
        event.start.toLocaleString().split('T')[0].startsWith(currentDay)
      );
      const i = this.calendarList;
      this.calendarOptions.events = this.calendarList;
    } else {
      this.calendarList = [];
      this.calendarOptions.events = this.calendarList;
    }
  }

  async getCategory() {
    try {
      const eventCat = await this.eventCatAPI.geteventCategoryAPI({});
      if (eventCat != null) {
        console.log('eventCat', eventCat);
        this.eventCategoryList = eventCat.data;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getCategoryById(id: string) {
    const eventCat = await this.eventCatAPI.geteventCategoryAPI({
      eventCatID: id,
    });
    if (eventCat != null) {
      this.eventCategory = eventCat.data;
    }
    console.log('eventCategoryById', this.eventCategory);
    return this.eventCategory;
  }

  showModal(event: CalendarEventModel) {
    this.sideClickedEvent = event;
    console.log('SideClick', this.sideClickedEvent);
  }

  showEventCard(info: any) {
    this.clickedEventDetails = this.calendarList.reduce((result, event) => {
      if (event.id.toString() === info.event.id) {
        result = event;
      }
      return result;
    });
    console.log(this.clickedEventDetails);
  }

  onCheckBoxValueChange(event: any, category: string) {
    if (event.target.checked) {
      // Checkbox is checked, add the category to the selected categories array
      this.selectedCategories.push(category);
    } else {
      // Checkbox is unchecked, remove the category from the selected categories array
      const index = this.selectedCategories.indexOf(category);
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
    if (this.selectedCategories.length > 0) {
      this.sortEvent();
    } else {
      this.loadEvents();
    }
  }

  async sortEvent() {
    this.calendarList = [];

    for (const item of this.eventListResponse) {
      const cid = item['eventCatID'];
      const eventCategory = await this.getCategoryById(cid.id.toString());

      if (eventCategory !== null) {
        const categoryNames = eventCategory.map((cat: any) => cat.name);

        if (
          this.selectedCategories.some((cat: string) =>
            categoryNames.includes(cat)
          )
        ) {
          let newCal: CalendarEventModel = {
            id: item['id'] ? item['id'].toString() : '',
            title: item['title'],
            start: item['startDateTime'],
            end: item['endDateTime'],
            description: item['description'],
          };
          this.calendarList.push(newCal);
        }
      }
    }

    this.calendarOptions.events = this.calendarList;
  }
}
