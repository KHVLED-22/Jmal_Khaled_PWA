import { MessageService } from 'primeng/api';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attribut, ValAttribut } from 'src/app/demo/api/attribut';
import { TableLazyLoadEvent } from 'primeng/table';
import { AttributService } from 'src/app/demo/service/attribut.service';

@Component({
  selector: 'app-ajouter-attribut',
  templateUrl: './ajouter-attribut.component.html',
  styleUrl: './ajouter-attribut.component.scss'
})
export class AjouterAttributComponent {
    @Input() sendAttribut: any;
    @Output() dataEvent = new EventEmitter<string>();


    AtttributDialog:boolean = false;
    disableSauvgarde: boolean = false;
    disableNom: boolean = false;
    submitted: boolean = false;
    exist: boolean = false;

    save: boolean = false;
    AddValue: boolean = false;
    EmptyTable: boolean = false;
    loading: boolean = false;
    // switchChange: boolean = false;
    Attribut:Attribut={
        nom:'',
        attribut_values:[],
        visible:false
    }
    NewValeurAttribut:ValAttribut={
        valeur:'',
        designation:''
    }
    OLdValAttribut:ValAttribut[]=[]
    oldAttribut:any
    changeAttribut:any={
        nom:false,
        attribut_values:false,
        visible:false
    }
    clonedProducts: { [s: string]: ValAttribut } = {};

    constructor(private messageService: MessageService,private AttrbitService: AttributService) {}


    async hideDialog(){
        this.AtttributDialog=false
        this.Attribut.id=null
        this.Attribut.nom='',
         this.Attribut.attribut_values=[],
         this.Attribut.visible=false
         this.NewValeurAttribut.valeur=''
         this.NewValeurAttribut.designation=''
         this.disableSauvgarde=false;
         this.disableNom=false
         this.submitted=false;
         this.exist=false;
         this.AddValue=false
        //  this.switchChange=false
        this.OLdValAttribut=[]
        this.oldAttribut={}
        this.changeAttribut={
            nom:false,
            attribut_values:false,
            visible:false
        }




    }


    showDialog(data?:any){
        this.AtttributDialog=true
        if(data){
            // console.log('attribut to update',data);
            this.Attribut.id=data.id
            this.Attribut.nom=data.nom
            // this.Attribut.designation=data.designation
            this.Attribut.attribut_values=data.attribut_values
            this.Attribut.visible=data.visible
            this.disableNom=true
            this.OLdValAttribut = JSON.parse(JSON.stringify(data.attribut_values));
            this.oldAttribut=JSON.parse(JSON.stringify(data));
            console.log('attribut to update',this.Attribut);


        }

    }

    // **********************************Row edit table*********************************************

    onRowEditInit(value: ValAttribut) {
        this.clonedProducts[value.id as string] = { ...value };
    }

    onRowEditSave(value: ValAttribut) {
        // if (value.price > 0) {
            console.log({...this.clonedProducts})
            let AttID = value.id

            if(value && (this.clonedProducts[AttID].valeur!==value.valeur || this.clonedProducts[AttID].designation!==value.designation)){
                delete this.clonedProducts[value.id as string];
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });


        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Au moins une valeur doit être changée.' });
        }
    }

    onRowEditCancel(value: any, index: number) {
        this.Attribut.attribut_values[index] = this.clonedProducts[value.id as string];
        delete this.clonedProducts[value.id as string];
    }
        // ***************************************Add Attribut Values****************************************
        AddAttributValues(){
            console.log(this.NewValeurAttribut)

            this.NewValeurAttribut.valeur=''
            this.NewValeurAttribut.designation=''
            this.AddValue=true;
            this.save=false;
            // if(!this.Attribut.id && this.Attribut.attribut_values.length==0){
            //     this.NewValeurAttribut={
            //         valeur:'',
            //         designation:''
            //     }
            // }


            // console.log(this.Attribut.attribut_values.length)
            // if(this.Attribut.attribut_values.length==0){
                // this.EmptyTable=true;
                if (this.Attribut.attribut_values.length === 0) {
                    this.Attribut.attribut_values.push({
                        // Add default values for the row
                        valeur: '',
                        designation: ''
                    });

                }
            // }
            // console.log(this.EmptyTable,this.Attribut.attribut_values)
        }
        // ***************************************Save Attribut Values****************************************
        saveValeurAttribut(){
            this.save=true;

            if (this.NewValeurAttribut.valeur?.trim() || this.NewValeurAttribut.designation?.trim()) {
                console.log(this.NewValeurAttribut)
                console.log(this.NewValeurAttribut)
                let valAttribut={
                    valeur:this.NewValeurAttribut.valeur,
                    designation:this.NewValeurAttribut.designation
                } as ValAttribut
                this.Attribut.attribut_values.push(valAttribut)
                this.AddValue=false;

                this.Attribut.attribut_values = this.Attribut.attribut_values.filter(obj =>
                    obj.valeur.trim() !== '' && obj.designation.trim() !== ''
                    );


                console.log('save new value',this.Attribut.attribut_values)

        }

        }
        // ***************************************Cancel Save Attribut Values****************************************
        CancelAddValue(){
            this.AddValue=false
            this.save=false;
        }
        // ***************************************save Attribut ****************************************
      async  saveAttribut(){
            this.submitted=true;

            if (this.Attribut.nom?.trim()) {
                // update attribut
                if (this.Attribut.id) {
                    console.log("Attribut to update",this.Attribut)
                    const changedRows = this.OLdValAttribut
                        .map(oldRow => {
                            const newRow = this.Attribut.attribut_values.find(newRow => newRow.id === oldRow.id);
                            // console.log(oldRow, newRow)
                            return { oldRow, newRow };
                        })
                        .filter(({ oldRow, newRow }) => newRow && (oldRow.valeur !== newRow.valeur || oldRow.designation !== newRow.designation))
                        .map(({ newRow }) => newRow)
                        .filter(row => row !== undefined) as ValAttribut[];


                    console.log('Changed rows:', changedRows);

                       // Check for new rows in attribut_values and push them into newRows array
                       const newRows = this.Attribut.attribut_values.filter(newRow => {
                        return !this.OLdValAttribut.some(oldRow => oldRow.id === newRow.id);
                    });

                    console.log('new rows:', newRows);


                    // this.Attribut.attribut_values = [ ...newRows, ...changedRows];
                    let newa_ttribut_values = [ ...newRows, ...changedRows];
                    console.log(newa_ttribut_values)



                    this.changeAttribut.attribut_values = changedRows.length > 0 || newRows.length > 0;


                    console.log(this.changeAttribut)

                    const update = Object.values(this.changeAttribut).some(value => value === true);
                    console.log('Update:', update);

                    if(update){

                     let   attributToUpdate={
                            id:this.Attribut.id,
                            nom:this.Attribut.nom,
                            attribut_values: newa_ttribut_values ,
                            visible:this.Attribut.visible
                        } as Attribut

                        console.log(this.Attribut.attribut_values)
                     await   this.AttrbitService.UpdateAttribut(attributToUpdate,this.Attribut.id).then(res=>
                            {console.log('reponse attribut updated',res)})
                            .catch(error => {
                                console.error('Error updating attribut:', error);
                            });

                    newa_ttribut_values=[]
                    attributToUpdate={
                        nom:'',
                        attribut_values:[],
                        visible:false
                    }

                    this.dataEvent.emit('refresh');
                    this.hideDialog()



                    }
                    else{
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Au moins une valeur doit être changée.' });

                    }

                }

                // save attribut
            else{
                let attribut={
                    nom:this.Attribut.nom,
                    attribut_values:this.Attribut.attribut_values,
                    visible:this.Attribut.visible
                }
                console.log(attribut)
            this.AttrbitService.postAttribut(attribut).then(res=>
                {console.log('reponse attribut ',res)
                if(res.message && res.message=='Le nom doit être unique'){
                    this.exist=true
                }
                else{
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Attribut ajouter avec succé', life: 3000 });

                    this.dataEvent.emit('refresh');
                    this.hideDialog()



                }


            })
                .catch(error => {
                    console.error('Error saving attribut:', error);
                });
            }

        }
    }

  // ***************************************detect Switch Change****************************************
  detectSwitchChange(event:any){
 if(this.Attribut.id){
    console.log('new',event.checked,'old',this.oldAttribut.visible)

    if(this.oldAttribut.visible!=event.checked){

    this.changeAttribut.visible=true

 }
//  else{
//     this.changeAttribut.visible=false

//  }
//  this.switchChange=true
}
  }
  // ***************************************detect input Change****************************************
  changeInput(event:any){
    // console.log(event?.target?.value)
    // this.changeAttribut.visible=true
   //  this.switchChange=true
   this.exist=false
   if(  this.Attribut.id){
    if(this.oldAttribut.nom!=event?.target?.value){
        this.changeAttribut.nom=true
    }
    else{
        this.changeAttribut.nom=false
    }
   }
   }



}
