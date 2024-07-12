import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

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

    constructor(private router: Router, private renderer: Renderer2) {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            const root = this.router.routerState.snapshot.root;
            const breadcrumbs: Breadcrumb[] = [];
            this.addBreadcrumb(root, [], breadcrumbs);

            this._breadcrumbs$.next(breadcrumbs);
        });
    }

    async ngOnInit() {
        this.checkOnlineStatus(); // offline pop up
        window.addEventListener('online', () => this.handleOnlineStatus(true)); // for custom popover 
        window.addEventListener('offline', () => this.handleOnlineStatus(false)); // for custom popover
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

    // popup  
    @HostListener('window:offline', ['$event'])
    onOffline(event: Event) {
        this.showOfflineModal();
    }

    @HostListener('window:online', ['$event'])
    onOnline(event: Event) {
        this.hideOfflineModal();
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

    // custom popover 
    checkOnlineStatus(): void {
        if (!navigator.onLine) {
            this.showOfflinePopover();
        }
    }

    handleOnlineStatus(isOnline: boolean): void {
        if (isOnline) {
            this.hideOfflinePopover();
        } else {
            this.showOfflinePopover();
        }
    }

    showOfflinePopover(): void {
        const popoverTrigger = document.getElementById('offlinePopover');
        if (popoverTrigger) {
            this.renderer.removeClass(popoverTrigger, 'd-none');
            const popover = new bootstrap.Popover(popoverTrigger);
            popover.show();
        }
    }

    hideOfflinePopover(): void {
        const popoverTrigger = document.getElementById('offlinePopover');
        if (popoverTrigger) {
            this.renderer.addClass(popoverTrigger, 'd-none');
            const popover = bootstrap.Popover.getInstance(popoverTrigger);
            if (popover) {
                popover.hide();
            }
        }
    }
}
