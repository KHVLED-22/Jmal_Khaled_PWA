import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ValCouleur } from 'src/app/demo/api/couleur';
import { CouleurService } from 'src/app/demo/service/couleur.service';

@Component({
  selector: 'app-ajouter-couleur',
  templateUrl: './ajouter-couleur.component.html',
  styleUrl: './ajouter-couleur.component.scss'
})
export class AjouterCouleurComponent {
    CouleurDialog:boolean = false;
    submitted:boolean = false;
    selectedCouleur:any
    oldCouleur:any
    couleur:ValCouleur={
        valeur: '',
        designation: '',
        code_hexa: '',
        attribut:{id:1}  }
        changeColorValue:any = {
            valeur:false,
            designation:false,
            code_hexa:false,
            attribut:false
        }
        changeselectedCouleur:boolean = false

        constructor(private couleurService: CouleurService,private messageService: MessageService) {}

     hideDialog(){
        this.CouleurDialog =false
        this.submitted=false
        this.selectedCouleur=''
        this.couleur={
            id:null,
            valeur: '',
            designation: '',
            code_hexa: '',
            attribut:{id:1}  }
        this.changeselectedCouleur=false
        this.changeColorValue={
            valeur:false,
            designation:false,
            code_hexa:false,
            attribut:false
        }
        this.oldCouleur={}
    }

    showDialog(data?:any){
        this.CouleurDialog = true;
        if(data){
            console.log(data)
            this.couleur.id=data.id
            this.couleur.designation=data.designation
            this.couleur.valeur=data.valeur
            this.couleur.code_hexa=data.code_hexa
            this.selectedCouleur=data.code_hexa
            this.oldCouleur={...this.couleur}
        }
    }
    async saveCouleur(){
        this.submitted=true
        if (this.couleur.valeur?.trim()  && this.couleur.designation?.trim() && this.couleur.code_hexa?.trim() && this.selectedCouleur?.trim()) {


            if(  this.couleur.id){
                const hasTrueValue = Object.values(this.changeColorValue).some(value => value);

                if (hasTrueValue || this.changeselectedCouleur) {
                    this.couleurService.UpdateCouleur(this.couleur,this.couleur.id).then(async data=>{
                        console.log(data)
                     await   this.hideDialog()
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Valeur Couleur modifiée avec succée' });


                    })
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Au moins une valeur doit être changée.' });

                }


            }
            else{

                console.log(this.couleur,this.selectedCouleur)
                this.couleurService.postCouleur(this.couleur).then(data=>{
                    console.log(data)
                    this.hideDialog()
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Valeur Couleur ajouter avec succée' });


                })
            }

        }

    }
    async changeCouleur(event:any){
    // console.log((event.value))
    this.changeselectedCouleur=true;
     this.couleur.code_hexa=event?.value
    }
    // codehexaChange(field: keyof ValCouleur,event:any){
    //     console.log((event.target.value))
    //     this.selectedCouleur=event.target.value
    //     if (this.oldCouleur[field] !== event.target.value) {
    //         this.changeColorValue[field] = true;
    //     } else {
    //         this.changeColorValue[field] = false;
    //     }
    // }
    async changevalue(field: keyof ValCouleur,event:any){
        // console.log((event.target.value))

        if(field=='code_hexa'){
            this.selectedCouleur=event?.target?.value
            this.changeselectedCouleur=true

        }
        if(  this.couleur.id){
            if (this.oldCouleur[field] !== event?.target?.value) {
                this.changeColorValue[field] = true;
            } else {
                this.changeColorValue[field] = false;
            }
            console.log(this.changeColorValue)

        }


    }
}
