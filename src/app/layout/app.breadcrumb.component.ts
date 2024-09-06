import { Component, OnInit, ElementRef, HostListener  } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
// { OfflineService } from 'src/app/demo/service/offline.service'; // Adjust path as per your project structure

interface Breadcrumb {
  label: string;
  url?: string;
}

declare var bootstrap: any; // for offline popup

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnInit {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(
    private router: Router,
    //private offlineService: OfflineService,
    private elementRef: ElementRef
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs: Breadcrumb[] = [];
      this.addBreadcrumb(root, [], breadcrumbs);

      this._breadcrumbs$.next(breadcrumbs);
    });
  }

  ngOnInit() {
    //ekher ctrl z
    // this.offlineService.isOnline$.subscribe(isOnline => {
    //   const popoverTrigger = this.elementRef.nativeElement.querySelector('#offlinePopover');

    //   if (isOnline) {
    //     console.log('breadcrumb offline ')
    //     this.offlineService.hideOfflinePopover(popoverTrigger);
    //     this.hideOfflineModal(); // Hide modal when online
    //     popoverTrigger.classList.add('d-none'); // Hide the button when online
    //   } else {
    //     this.offlineService.showOfflinePopover(popoverTrigger);
    //     this.showOfflineModal(); // Show modal when offline
    //     popoverTrigger.classList.remove('d-none'); // Show the button when offline
    //   }
    // });
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
    const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
    const breadcrumb = route.data['breadcrumb'];
    const parentBreadcrumb = route.parent && route.parent.data ? route.parent.data['breadcrumb'] : null;

    if (breadcrumb && breadcrumb !== parentBreadcrumb) {
      breadcrumbs.push({
        label: route.data['breadcrumb'],
        url: '/' + routeUrl.join('/')
      });
    }

    if (route.firstChild) {
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  showOfflineModal() {
    const modalElement = document.getElementById('offlineModal');
    const myModal = new bootstrap.Modal(modalElement);
    myModal.show();
  }

  hideOfflineModal() {
    const modalElement = document.getElementById('offlineModal');
    const myModal = bootstrap.Modal.getInstance(modalElement);
    if (myModal) {
      myModal.hide();
    }
  }

  // Popup
  @HostListener('window:offline', ['$event'])
  onOffline(event: Event) {
    this.showOfflineModal();
    const popoverTrigger = this.elementRef.nativeElement.querySelector('#offlinePopover');
    popoverTrigger.classList.remove('d-none'); // Show the button when offline
  }

  @HostListener('window:online', ['$event'])
  onOnline(event: Event) {
    this.hideOfflineModal();
    const popoverTrigger = this.elementRef.nativeElement.querySelector('#offlinePopover');
    popoverTrigger.classList.add('d-none'); // Hide the button when online
  }
}
