import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class EventBusService {
  publish(prop: string, message: any): void {
    if ( this[prop] && !this[prop].isUnsubscribed ) {
      this[prop].next(message);
    }
  }

  subscribe(prop: string, callback?: Function): void {
    this[prop] = new Subject<any>();
    this[prop].subscribe(callback);
  }

  unsubscribe(prop: string) {
    this[prop].unsubscribe();
  }
}
