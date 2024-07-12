import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Categorie } from 'src/app/demo/api/categorie';
import { CategorieService } from 'src/app/demo/service/categorie.service';

@Component({
  selector: 'app-fiche-categorie',
  templateUrl: './fiche-categorie.component.html',
  styleUrl: './fiche-categorie.component.scss',
  providers: [MessageService]

})
export class FicheCategorieComponent {
    private subscription: Subscription | null = null;
    show:boolean = false;
    uploadedFiles: any[] = [];
    uploadNew:boolean = false;
    getFiles: any
    idImage:any = null;
    categories:Categorie[] =[]
    spinnerShow:boolean = true;
    niveauCategorie:any=[
        {niveau:1},
        {niveau:2},
        {niveau:3},
        {niveau:4},

    ];
    niveauParent:any[]=[]
    categorie:Categorie=
    {
        id:0,
        nom:"",
        designation :"",
        description:"",
        image:"",
        baliseTitre:"",
        metaDescription:"",
        metaMotsCles:"",
        urlSimplifiee:"",
        niveau:0,
        niveauParent:0,
        activer:false,
        activerMenu:false


    };
    oldCategorie:Categorie=
    {
        id:0,
        nom:"",
        designation :"",
        description:"",
        image:"",
        baliseTitre:"",
        metaDescription:"",
        metaMotsCles:"",
        urlSimplifiee:"",
        niveau:0,
        niveauParent:0,
        activer:false,
        activerMenu:false


    };
     inputChanges = {
        nom: false,
        designation: false,
        baliseTitre: false,
        metaMotsCles: false,
        urlSimplifiee: false,
        metaDescription: false
    };
   dropdownChanges = {
        niveau: false,
        niveauParent: false,

    };
    editorChange:boolean = false;
    switchChanges:boolean = false;
    disableSauvgarde:boolean = false;


    constructor(private messageService: MessageService,private CategorieService: CategorieService,private router: Router) {}

     async ngOnInit() {
     let receivedCateg:any
     await this.CategorieService.getCategorie().then((data:any) =>
     { this.categories = data.categories
      console.log('Categories:', this.categories);
      });
    try {
     await     this.CategorieService.data$.subscribe(data => {
            console.log(data)
            this.getFiles=true;
            receivedCateg=data

        })}catch (error) {
            console.error("Error occurred while fetching data:", error);
        }
        console.log(receivedCateg)

        let filtredNiveau= this.categories.filter((category: Categorie) => {
        return    category.niveau === (receivedCateg?.niveau ? +receivedCateg?.niveau - 1 : undefined)});
        this.niveauParent=filtredNiveau.map((category: Categorie) =>
        ({id: category.id,
          nom: category.nom,
        }));
        console.log(this.niveauParent);


        this.categorie.id=receivedCateg.id
        this.categorie.nom=receivedCateg.nom
        this.categorie.designation=receivedCateg.designation
        this.categorie.niveau={niveau:receivedCateg?.niveau}
        this.categorie.niveauParent=receivedCateg?.niveauParent
        this.categorie.activer=receivedCateg?.activer
        this.categorie.activerMenu=receivedCateg?.activerMenu

        this.categorie.description=receivedCateg?.description
        this.categorie.image=receivedCateg?.image_categ
        this.categorie.baliseTitre=receivedCateg?.baliseTitre
        this.categorie.metaDescription=receivedCateg?.metaDescription
        this.categorie.metaMotsCles=receivedCateg?.metaMotsCles
        this.categorie.urlSimplifiee=receivedCateg?.urlSimplifiee
        this.categorie.path=receivedCateg?.path
        this.categorie.nbArticles=receivedCateg?.nbArticles
        this.idImage=receivedCateg?.image_categ.id
        console.log(this.categorie)
        this.oldCategorie={...this.categorie}

    }

    onUpload(event: any) {
        this.uploadNew=true
        this.idImage=event.originalEvent.body[0].id
        console.log(this.idImage)
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        console.log("uploadedfiles",this.uploadedFiles);

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Image chargé' });
    }
    changeImage(){
        this.getFiles=false
    }
    niveauCategChange(champ:any,event:any){
        // console.log('event :' + event);
        // console.log(event.value.niveau);
        let  newValue =event.value
        if(newValue !== this.oldCategorie.niveau){
            this.dropdownChanges.niveau=  newValue !== this.oldCategorie.niveau;

        }
        let filtredNiveau= this.categories.filter((category: Categorie) => {
            // console.log('niveau parent ',category.niveau);
            return    category.niveau === (event.value.niveau ? +event.value.niveau - 1 : undefined)});
        // console.log(filtredNiveau);
        this.niveauParent=filtredNiveau.map((category: Categorie) =>
        ({id: category.id,
          nom: category.nom,
        }));
        console.log(this.niveauParent);

    }
    niveauCategParChange(champ:any,event:any){
        let  newValue =event.value
        if(newValue !== this.oldCategorie.niveauParent){
            this.dropdownChanges.niveauParent=  newValue !== this.oldCategorie.niveauParent;

        }

    }
    detectChangesInput(champ:string,event: Event){
        // console.log('event on input', (event.target as HTMLInputElement).value)
       let  newValue = (event.target as HTMLInputElement).value
        switch (champ) {

            case 'nom':
              this.inputChanges.nom  =newValue !== this.oldCategorie.nom;
            //   changedInputName = this.inputsChanges.code_article_generique ? 'code_article_generique' : null;

              break;
            case 'designation':
              this.inputChanges.designation=  newValue !== this.oldCategorie.designation;

              break;
            case 'baliseTitre':
                this.inputChanges.baliseTitre= newValue !== this.oldCategorie.baliseTitre;

                break;
            case 'metaDescription':
            this.inputChanges.metaDescription= newValue !== this.oldCategorie.metaDescription;

            break;
            case 'metaMotsCles':
                this.inputChanges.metaMotsCles= newValue !== this.oldCategorie.metaMotsCles;

                break;
            case 'urlSimplifiee':
            this.inputChanges.urlSimplifiee= newValue !== this.oldCategorie.urlSimplifiee;

            break;

        }

    }
    handleChange(champ:string,event:any){
    console.log(event.cheked);
    if(event.cheked!==this.oldCategorie.activer || event.cheked!==this.oldCategorie.activerMenu){
        this.switchChanges=true;
    }
    }
    detectChangesEditor(event:any){
        console.log('event on editor',event.textValue)
        if(event.textValue!==this.oldCategorie.description){
            this.editorChange=true;
        }
    }
    reset(){
        // this.categorie={
        //     nom:"",
        //     designation :"",

        // }
        // this.oldCategorie={
        //     nom:"",
        //     designation :"",

        // }
        this.switchChanges=false
        this.editorChange=false
        this.dropdownChanges={
            niveau: false,
            niveauParent: false,
        }
        this.inputChanges={
            nom: false,
            designation: false,
            baliseTitre: false,
            metaMotsCles: false,
            urlSimplifiee: false,
            metaDescription: false
        }
    }
    updateCategorie(){
        this.disableSauvgarde=false;
        console.log('Old categ',this.oldCategorie)
        console.log('input changes',  this.inputChanges)
        console.log('dropdown changes',  this.dropdownChanges)
        console.log('editor change',  this.editorChange)
        console.log('switch change',  this.switchChanges)
        const shouldUpdate = Object.values(this.inputChanges).some(val => val === true) ||
        Object.values(this.dropdownChanges).some(val => val === true) ||
        this.editorChange || this.switchChanges || this.uploadNew;
        console.log('shouldUpdate', shouldUpdate)
        if (shouldUpdate) {
            let categ={
                nom:this.categorie.nom,
                designation:this.categorie.designation,
                niveau: this.categorie.niveau.niveau,
                categ_par:this.categorie.niveauParent,
                visible: this.categorie.activer,
                visible_menu: this.categorie.activerMenu,
                description: this.categorie.description,
                image_categ: this.idImage,
                balise_titre:this.categorie.baliseTitre,
                meta_desc: this.categorie.metaDescription,
                meta_motsCle: this.categorie.metaMotsCles,
                url_simp: this.categorie.urlSimplifiee,
                // path:this.categorie.path,
                // nbArticles:this.categorie.nbArticles
            }
            this.CategorieService.updateCategorie(categ,this.categorie.id).then(res=>
           {     console.log('updated categ',res)
                this.disableSauvgarde=true
                this.reset()
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Catégorie Modifier', life: 3000 });
                // this.router.navigate(['/categories/liste-categorie']);

            }
                );
                this.router.navigate(['/categories/liste-categorie']);

        }
        else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Au moins une valeur doit être changée.' });

        }

    }

}
