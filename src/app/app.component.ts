import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, from, fromEvent, of } from 'rxjs';
import { concatMap, delay, filter, map, take } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular';
  shouldEmit$ = new BehaviorSubject(false);
  clickEvent$ = fromEvent(document, 'click').pipe(
    map(() => this.shouldEmit$.next(!this.shouldEmit$.value))
  );
  values = ['A', 'BB', 10, 'CCC', 'DDDD', 20, 'EEEEE', 'FFFFFF', 30];

  ngOnInit() {
    this.clickEvent$.subscribe();

    const source = from(this.values).pipe(
      concatMap((value) =>
        this.shouldEmit$.pipe(
          filter((shouldEmit) => shouldEmit), // Only resume if true
          take(1),
          concatMap(() => of(value).pipe(delay(1000)))
        )
      )
    );
    source.subscribe((value) => {
      console.log(value);
      !this.shouldEmit$.value && console.log('Emissions paused');
    });
  }
}
