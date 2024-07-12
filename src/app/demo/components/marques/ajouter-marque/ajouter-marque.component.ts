import { Marque } from 'src/app/demo/api/marque';
import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MarqueService } from 'src/app/demo/service/marque.service';

@Component({
  selector: 'app-ajouter-marque',
  templateUrl: './ajouter-marque.component.html',
  styleUrl: './ajouter-marque.component.scss'
})
export class AjouterMarqueComponent {
    @Output() sendMarque = new EventEmitter<any>();
    @Output() dataEvent = new EventEmitter<any>();



    marquetDialog:boolean = false;
    submitted: boolean = false;
    uploadedFiles: any[] = [];
    idImage:any = null;
    labelButton:any
    disableSauvgarde: boolean = false;
    updateFile:boolean = false;
    updateMarque:boolean = false;
    existNom: boolean = false;
    existDesignation: boolean = false;

    oldMarque:any
    Marque:Marque={
        nom:'',
        logo:null,
        designation:'',
    }


    constructor(private MarqueService: MarqueService,private messageService: MessageService) {}


    hideDialog(){
        this.marquetDialog =false
        this.idImage=null;
        this.Marque.id=null;
        this.Marque.nom='';
        this.Marque.designation='';
        this.Marque.logo=null;
        this.Marque.activer=false;
        this.uploadedFiles=[]
        this.disableSauvgarde=false;
        this.submitted = false;
        this.updateMarque=false
        this.existNom=false
        this.existDesignation=false

        this.oldMarque={}


    }

    showDialog(data?:any){
        this.marquetDialog = true;
        if(data){
            console.log("marque to update",data)
            this.updateMarque=true
            this.updateFile=true
            this.Marque.nom=data.nom
            this.Marque.designation=data.designation
            this.Marque.logo=data.logo
            this.Marque.id=data.id
            this.Marque.activer=data.activer
            this.idImage=data.logo.id
            this.oldMarque={...this.Marque}
        }
    }
    changeImage(){
        this.updateFile=false
    }
    onUpload(event: any) {
        // this.uploadNew=true
        this.idImage=event.originalEvent.body[0].id
        console.log(this.idImage)
        console.log(event)

        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        console.log("uploadedfiles",this.uploadedFiles);
        this.Marque.logo=this.idImage
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Image chargé' });
    }

    async savemarque(){
        // let niveau :any
        this.submitted = true;
        // this.exist=false

        if (this.Marque.nom?.trim() && this.idImage !== null) {
           if(this.updateMarque){
                   // Check if at least one value has changed
                   let changesMade = false;
                   for (const prop in this.oldMarque) {
                    if (prop === 'logo') {
                        if (this.oldMarque[prop].id!== this.idImage) {
                            changesMade = true;
                            break;
                        }
                    };
                       if (this.oldMarque.hasOwnProperty(prop) && this.Marque.hasOwnProperty(prop)) {
                           if ((this.oldMarque as any)[prop] !== (this.Marque as any)[prop]) { // Type assertion here
                               changesMade = true;
                               break;
                           }
                       }
                   }

                   if (changesMade) {
                       // Update the marque
                       // Implement your update logic here
                       console.log("should update" )
                       let UpdatedMarque={
                        id:this.Marque.id,
                        nom:this.Marque.nom,
                        designation:this.Marque.designation,
                        logo:this.idImage,
                        activer:this.Marque.activer

                    }
                         this.MarqueService.UpdateMarque(UpdatedMarque,this.Marque.id).then(res=>
                        { console.log('updated marque',res)
                        this.dataEvent.emit('refresh');
                        this.hideDialog();
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Marque Modifier', life: 3000 });

                        }                            );

                   } else {
                       // No changes, do nothing or handle accordingly
                       console.log("shouldn't update" )
                       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Au moins une valeur doit être changée.' });


                   }
           }
           else{

            const marqueToSend = { ...this.Marque };

            // Exclude the id property from the copy
            delete marqueToSend.id;

            await this.MarqueService.postMarque(marqueToSend).then((data:any) =>
            {
             console.log('marque:', data);

             if(data.message && data.message=='nom doit être unique'){
                this.existNom=true
            }
            else
            if(data.message && data.message=='désignation doit être unique'){
                this.existDesignation=true
            }
            else{
                this.disableSauvgarde=true
                this.sendMarque.emit(data)
                this.dataEvent.emit('refresh');
                this.hideDialog();

            }

            });
           }



              }

    }


    detectChanges(fiels:string,event:any){

    this.existNom=false
    this.existDesignation=false
    }

}
