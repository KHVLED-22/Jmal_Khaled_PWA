import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {
    @Output() responseConfirm = new EventEmitter<any>();

    deleteDialog: boolean = false;
    hideDialog(){
        this.deleteDialog=false
    }
    showDialog(){
        this.deleteDialog=true
    }
    confirmDelete(data:string){
        if(data=="oui"){
            this.deleteDialog=false
            this.responseConfirm.emit(data)
        }
        else{
            this.responseConfirm.emit(data)

            this.deleteDialog=false

        }
    }
}
