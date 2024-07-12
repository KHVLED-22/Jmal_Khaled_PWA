import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Categorie } from 'src/app/demo/api/categorie';
import { Product } from 'src/app/demo/api/product';
import { CategorieService } from 'src/app/demo/service/categorie.service';

@Component({
  selector: 'app-ajouter-categorie',
  templateUrl: './ajouter-categorie.component.html',
  styleUrl: './ajouter-categorie.component.scss'
})
export class AjouterCategorieComponent {
    @Output() sendCategorie = new EventEmitter<any>();
    @Input() listCateg: any;
    existDesignation: boolean = false;
    existNom: boolean = false;

    submitted: boolean = false;
    categorietDialog: boolean = false;
    disableSauvgarde: boolean = false;
    niveauCategorie:any=[
        {niveau:1},
        {niveau:2},
        {niveau:3},
        {niveau:4},

    ];
    niveauParent:any[]=[]
     Newcategorie:Categorie =
     {
        nom: "",
        designation : "",
        niveau: 0,
        niveauParent:0,
        activer: false,
        activerMenu: false,

     };
     constructor(private CategorieService: CategorieService) {}

      ngOnChanges() {
        setTimeout(() => {         console.log("liste categ child",this.listCateg)
    });

// *************************************Close Dialog***************************************
    }
    hideDialog(){
        this.categorietDialog=false
        this.submitted = false;
        this.disableSauvgarde=false;


        this.Newcategorie =
     {
        nom: "",
        designation : "",
        niveau: 0,
        niveauParent:0,
        activer: false,
        activerMenu: false,

     };

    }

    // *************************************save categ***************************************

    async saveCategory(){
        let niveau :any
        let niveauParent :any
        this.submitted = true;
        this.existDesignation=false
        this.existNom=false
        let oldNiveau={...this.Newcategorie.niveau}


        if (this.Newcategorie.nom?.trim() && this.Newcategorie.designation.trim()) {
            if (this.Newcategorie.niveau && this.Newcategorie.niveau) {
                 niveau=this.Newcategorie.niveau
                this.Newcategorie.niveau = niveau.niveau;
                if(this.Newcategorie.niveau ==1){
                    this.Newcategorie.niveauParent=null
                }

            }
            console.log(this.Newcategorie)

            let categ={
                nom: this.Newcategorie.nom,
                designation: this.Newcategorie.designation,
                niveau: this.Newcategorie.niveau,
                categ_par: this.Newcategorie.niveauParent,
                visible: this.Newcategorie.activer,
                visible_menu: this.Newcategorie.activerMenu,
            }

            // const exists = this.listCateg.some((categ :Categorie)=> categ.designation === this.Newcategorie.designation);
            // if (exists) {
            //     console.log('Category with the same designation already exists');
            //     this.exist=true
            //   } else {
                // console.log('No category with the same designation exists');
                await this.CategorieService.postCategorie(categ).then((data:any) =>
            {
                //  this.categories = data
             console.log('Categories:', data);
             if(data.message){
                if(data.message=='désignation doit être unique'){
                this.existDesignation=true
                this.Newcategorie.niveau=oldNiveau;

                }
                if(data.message=='nom doit être unique'){
                    this.existNom=true
                    this.Newcategorie.niveau=oldNiveau;

                }
                // else
             }
             else{
                this.disableSauvgarde=true
                this.sendCategorie.emit(data)
                this.hideDialog()
             }

            });

              }

        // }
    }
// *************************************detect changes ***************************************

    detectChange(event:any){

        this.existNom=false
        this.existDesignation=false
    }

    niveauCategChange(event:any){
        // console.log('event :' + event);
        // console.log(event.value.niveau);
        console.log("liste categ child",this.listCateg)
        let filtredNiveau= this.listCateg.filter((category: Categorie) => {
            // console.log('niveau parent ',category.niveau);
            return    category.niveau === (event.value.niveau ? +event.value.niveau - 1 : undefined)});
        console.log(filtredNiveau);
        this.niveauParent=filtredNiveau.map((category: Categorie) =>
        ({id: category.id,
          designation: category.designation,
        }));
        console.log(this.niveauParent);

    }
}