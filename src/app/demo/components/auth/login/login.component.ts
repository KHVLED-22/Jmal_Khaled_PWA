import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/demo/components/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    providers: [MessageService, ConfirmationService]
})
export class LoginComponent {
    rememberMe: boolean = false;
    email: string = '';
    password: string = '';

    constructor(private layoutService: LayoutService, private authService: AuthService ,  private messageService: MessageService, private router: Router) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    login() {
        this.authService.login(this.email, this.password).subscribe(
          response => {
            console.log('Login successful', response);
            this.router.navigate(['/pointages/list-pointages']);
          },
          error => {
            console.error('Login failed', error);
                this.messageService.add({ severity: 'error', summary: 'Erreur de connexion', detail: 'Identifiant ou mot de passe invalide' });
          }
        );
      }
    
}
