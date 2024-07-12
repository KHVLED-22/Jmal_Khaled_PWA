import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { variation } from 'src/app/demo/api/article';
import { VariationService } from 'src/app/demo/service/variation.service';

@Component({
  selector: 'app-modifier-variation',
  templateUrl: './modifier-variation.component.html',
  styleUrl: './modifier-variation.component.scss',
  providers: [MessageService]

})
export class ModifierVariationComponent {
    @Output() VariationToSend: EventEmitter<any> = new EventEmitter<any>();

VariationDialog:boolean = false;
variation:variation={
    prix_achat:0

}
oldVariation:variation={
    prix_achat:0
}
variationChanged:boolean = false;
updatedVariation:any = {};

constructor(private messageService: MessageService,private variationService:VariationService) {}

hideDialog(){
    this.VariationDialog=false
}
showDialog(data?:any){
    this.VariationDialog=true
    if(data){
        // this.variation.stock=data.stock
        // this.variation.prix_achat=data.prix_achat
        // this.variation.prix_vente=data.prix_vente
        // this.variation.remise=data.remise
        this.variation={...data}

        console.log(this.variation)
        this.oldVariation={...this.variation}
        // console.log(this.oldVariation)

    }
}
async saveVariation(){
if(this.variationChanged){
    console.log(this.variation)
  await   this.variationService.UpdateVariation(this.variation,this.variation.id).then((res:any) => {console.log(res)

        this.updatedVariation={
            activer:res.activer,
            article:res.article.nom_article ,
            attribut_value:res.attribut_value,
            code_barre:res.code_a_barre,
            couleur:res.couleur_image.attribut_value,
            id:res.id,
            images:res.couleur_image.col_images,
            prix_achat:res.prix_achat,
            prix_vente:res.prix_vente,
            stock:res.stock,
        }
    })
    console.log(this.updatedVariation)
   await  this.VariationToSend.emit(this.updatedVariation)
    this.hideDialog()
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Variation Modifié avec succée.' });





}else{
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Au moins une valeur doit être changée.' });

}
}
changeInputValue(field:keyof variation,event:any){
    console.log(event.value)
    let  newValue = event.value
    if (newValue && newValue !== this.oldVariation[field]) {
        this.variationChanged = true;
    } else {
        this.variationChanged = false;
    }
    if (field === 'remise' && newValue !== this.oldVariation[field]) {
        const prixAchat = this.variation.prix_achat;
        const remise = newValue;
        const newPrixVente = prixAchat * (1 - remise / 100);

        // Update the prix_vente property
        this.variation['prix_vente'] = newPrixVente;


}



}
}
