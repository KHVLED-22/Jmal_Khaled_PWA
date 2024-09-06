import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare var bootstrap: any; // Assuming Bootstrap is included globally

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  private readonly _isOnline$ = new BehaviorSubject<boolean>(navigator.onLine);
  readonly isOnline$ = this._isOnline$.asObservable();

  constructor(private ngZone: NgZone) {
    this.setupListeners();
    //this.setupOnlineRefresh(); 

  }

  private setupListeners(): void {
    window.addEventListener('online', () => this.ngZone.run(() => this.handleOnlineStatus(true)));
    window.addEventListener('offline', () => this.ngZone.run(() => this.handleOnlineStatus(false)));
  }

  private handleOnlineStatus(isOnline: boolean): void {
    this._isOnline$.next(isOnline);
    if (isOnline) {
      this.hideOfflinePopover();
    } else {
      this.showOfflinePopover();
    }
  }

  showOfflinePopover(popoverTrigger?: HTMLElement): void {
    if (popoverTrigger) {
      popoverTrigger.classList.remove('d-none');
      const popover = new bootstrap.Popover(popoverTrigger);
      popover.show();
    }
  }

  hideOfflinePopover(popoverTrigger?: HTMLElement): void {
    if (popoverTrigger) {
      popoverTrigger.classList.add('d-none');
      const popover = bootstrap.Popover.getInstance(popoverTrigger);
      if (popover) {
        popover.hide();
      }
    }
  }
  // private setupOnlineRefresh(): void {
  //   let hasRefreshed = false;
  
  //   this.isOnline$.subscribe(isOnline => {
  //     if  (!isOnline) {
  //       hasRefreshed = false;
  //     } else if(isOnline && !hasRefreshed) {
  //       hasRefreshed = true;
  //       window.location.reload();
  //     }
  //   });
  // }
  
}
