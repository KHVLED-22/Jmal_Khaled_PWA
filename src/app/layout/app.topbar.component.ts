import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppSidebarComponent } from './app.sidebar.component';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    activeItem!: number;
    tieredItems: MenuItem[] = [];
    searchQuery: string = '';
    searchResults: MenuItem[] = [];

    menuItems: MenuItem[] = [
        {
          label: 'Dashboards',
          icon: 'pi pi-home',
          items: [
            { label: 'Acceuil', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
          ]
        },
        {
          label: 'Modules',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Pointages',
              icon: 'pi pi-fw pi-clock',
              items: [
                { label: 'Gestion des pointages', icon: 'pi pi-fw pi-clock', routerLink: ['/pointages/list-pointages'] }
              ]
            },
            {
              label: 'Employe',
              icon: 'pi pi-fw pi-user',
              items: [
                { label: 'Gestion des employes', icon: 'pi pi-fw pi-users', routerLink: ['/employe/list-employe'] }
              ]
            }
          ]
        },
        {
          label: 'Parametres',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Paramètres',
              icon: 'pi pi-fw pi-wrench',
              items: [
                {
                  label: 'Paramètres Pointage',
                  icon: 'pi pi-fw pi-cog',
                  items: [
                    { label: 'Gestion des etablissement', icon: 'pi pi-fw pi-home', routerLink: ['/etablissement/list-etab'] },
                    { label: 'Gestion des machines', icon: 'pi pi-fw pi-server', routerLink: ['/machine/list-machine'] }
                  ]
                },
                {
                  label: 'Paramètres des Entités',
                  icon: 'pi pi-fw pi-cog',
                  items: [
                    { label: 'Gestion des societes', icon: 'pi pi-fw pi-home', routerLink: ['/societe/list-societe'] },
                    { label: 'Gestion des departement', icon: 'pi pi-fw pi-bars', routerLink: ['/departement/list-departement'] },
                    { label: 'Gestion des equipes', icon: 'pi pi-fw pi-users', routerLink: ['/equipe/list-equipe'] },
                    { label: 'Gestion des contract', icon: 'pi pi-fw pi-file', routerLink: ['/contract/list-contract'] },
                    { label: 'Gestion des poste', icon: 'pi pi-fw pi-users', routerLink: ['/poste/list-poste'] }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: 'Planing',
          icon: 'pi pi-fw pi-hourglass',
          items: [
            { label: 'Groupes des planing', icon: 'pi pi-fw pi-list', routerLink: ['/GRPplaning/groupe-planing'] },
            { label: 'liste des planing', icon: 'pi pi-fw pi-hourglass', routerLink: ['/planing/list-planing'] }
          ]
        },
        {
          label: 'Profil',
          icon: 'pi pi-fw pi-sign-in',
          items: [
            {
              label: 'Déconnexion',
              icon: 'pi pi-fw pi-sign-in',
              command: () => this.logout()
            }
          ]
        }
      ];
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/auth/login']);
      }

    constructor(public layoutService: LayoutService, public el: ElementRef , private router: Router) {}

    onSearch() {
        if (this.searchQuery.trim().length > 0) {
          this.searchResults = this.filterMenuItems(this.menuItems, this.searchQuery.trim().toLowerCase());
        } else {
          this.searchResults = [];
        }
      }
    
      filterMenuItems(items: MenuItem[], query: string): MenuItem[] {
        let results: MenuItem[] = [];
        for (let item of items) {
          if (item.label!.toLowerCase().includes(query)) {
            results.push(item);
          }
          if (item.items) {
            const subResults = this.filterMenuItems(item.items, query);
            results = results.concat(subResults);
          }
        }
        return results;
      }
    
      navigateTo(route: string[]) {
        this.router.navigate(route);
        this.searchQuery = '';
        this.searchResults = [];
      }

    ngOnInit() {
        

        this.tieredItems = [
            {
                label: 'Customers',
                icon: 'pi pi-fw pi-table',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-fw pi-plus',
                        items: [
                            {
                                label: 'Customer',
                                icon: 'pi pi-fw pi-plus'
                            },
                            {
                                label: 'Duplicate',
                                icon: 'pi pi-fw pi-copy'
                            }
                        ]
                    },
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-user-edit'
                    }
                ]
            },
            {
                label: 'Orders',
                icon: 'pi pi-fw pi-shopping-cart',
                items: [
                    {
                        label: 'View',
                        icon: 'pi pi-fw pi-list'
                    },
                    {
                        label: 'Search',
                        icon: 'pi pi-fw pi-search'
                    }
                ]
            },
            {
                label: 'Shipments',
                icon: 'pi pi-fw pi-envelope',
                items: [
                    {
                        label: 'Tracker',
                        icon: 'pi pi-fw pi-compass'
                    },
                    {
                        label: 'Map',
                        icon: 'pi pi-fw pi-map-marker'
                    },
                    {
                        label: 'Manage',
                        icon: 'pi pi-fw pi-pencil'
                    }
                ]
            },
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-fw pi-cog'
                    },
                    {
                        label: 'Billing',
                        icon: 'pi pi-fw pi-file'
                    }
                ]
            },
            { separator: true },
            {
                label: 'Quit',
                icon: 'pi pi-fw pi-sign-out'
            }
        ];
}
    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onSidebarButtonClick() {
        this.layoutService.showSidebar();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }
}
