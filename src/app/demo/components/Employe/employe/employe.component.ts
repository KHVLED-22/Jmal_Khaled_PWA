import { Component } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { Employee } from '../../models/Employe';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrl: './employe.component.scss',
  providers: [MessageService, ConfirmationService ]
})
export class EmployeComponent {

  items: MenuItem[] = [];
  activeIndex: number = 0;
  employee: Employee = new Employee(null, {});
  sexes: SelectItem[] = [
    { label: 'Masculin', value: 'M' },
    { label: 'Féminin', value: 'F' }
  ];

  etatCivils: SelectItem[] = [
    { label: 'Célibataire', value: 'celibataire' },
    { label: 'Marié', value: 'marie' },
    { label: 'Divorcé', value: 'divorce' }
  ];

  postes: SelectItem[] = [
    { label: 'Développeur', value: 'developpeur' },
    { label: 'Manager', value: 'manager' }
    // Add more options as needed
  ];

  departements: SelectItem[] = [
    { label: 'Informatique', value: 'informatique' },
    { label: 'Ressources Humaines', value: 'rh' }
    // Add more options as needed
  ];

  societes: SelectItem[] = [
    { label: 'Société A', value: 'societe_a' },
    { label: 'Société B', value: 'societe_b' }
    // Add more options as needed
  ];

  equipes: SelectItem[] = [
    { label: 'Équipe 1', value: 'equipe_1' },
    { label: 'Équipe 2', value: 'equipe_2' }
    // Add more options as needed
  ];

  regimeHoraires: SelectItem[] = [
    { label: 'Temps plein', value: 'temps_plein' },
    { label: 'Temps partiel', value: 'temps_partiel' }
    // Add more options as needed
  ];

  typesContrats: SelectItem[] = [
    { label: 'CDI', value: 'cdi' },
    { label: 'CDD', value: 'cdd' }
    // Add more options as needed
  ];
  visible = true

  constructor() { }

  ngOnInit(): void {
    this.items = [
      { label: 'Informations personnelles' },
      { label: 'Informations professionnelles' },
      { label: 'Paramètre RH' },
      { label: 'Document' }
    ];
  }

  onNext() {
    this.activeIndex++;
  }

  onPrevious() {
    this.activeIndex--;
  }

  onSubmit() {
    // Handle form submission
    console.log(this.employee);
  }

}
