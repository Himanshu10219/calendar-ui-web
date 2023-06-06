import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataObserverHelper {

    private sessionRefresh = new Subject<boolean>();
    private categoryRefresh = new Subject<boolean>();

    updateEvent(data: any) {
        this.sessionRefresh.next(data);
    }
    ObsSessionRefresh() {
        return this.sessionRefresh.asObservable();
    }

    updatecategoryRefresh(data: any) {
        this.categoryRefresh.next(data);
    }
    ObsCategoryRefresh() {
        return this.categoryRefresh.asObservable();
    }
}
