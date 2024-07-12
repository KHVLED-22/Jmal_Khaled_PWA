import { map } from 'rxjs/operators';
import { variation } from './../../../api/article';
import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren ,DoCheck } from '@angular/core';
import { LazyLoadEvent, MenuItem, MessageService, TreeNode } from 'primeng/api';
import { Attribut, ValAttribut } from 'src/app/demo/api/attribut';
import { Categorie } from 'src/app/demo/api/categorie';
import { Marque } from 'src/app/demo/api/marque';
import { AttributService } from 'src/app/demo/service/attribut.service';
import { CategorieService } from 'src/app/demo/service/categorie.service';
import { CouleurService } from 'src/app/demo/service/couleur.service';
import { MarqueService } from 'src/app/demo/service/marque.service';
import { NodeService } from 'src/app/demo/service/node.service';
import { ModifierVariationComponent } from '../modifier-variation/modifier-variation.component';
import { AjouterImagesComponent } from '../ajouter-images/ajouter-images.component';
import { article } from 'src/app/demo/api/article';
import { ImageService } from 'src/app/demo/service/image.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { ArticleService } from 'src/app/demo/service/article.service';
import { ActivatedRoute } from '@angular/router';




interface Image {
    name: string;
    objectURL: string;
}
@Component({
  selector: 'app-ajouter-article',
  templateUrl: './ajouter-article.component.html',
  styleUrl: './ajouter-article.component.scss',
  providers: [MessageService]

})

export class AjouterArticleComponent {
    @ViewChildren('buttonEl') buttonEl!: QueryList<ElementRef>;
    @ViewChild(ModifierVariationComponent) DialogVariation!: ModifierVariationComponent;
    @ViewChild(AjouterImagesComponent) ImageDialog!: AjouterImagesComponent;
    // saved:boolean = false;
    disableAttribut:boolean = false;
    ConfirmDialog:boolean =false
    changedListParent:any
    changed:boolean =false
    // ArticleChnaged:boolean = false
    submitted:boolean =false
    uploadImages:boolean =false
    idArticle:any
    update:boolean=false
    nodes!: any[];
    colors:any=[]
    images:any[] = [];
    files1: TreeNode[] = [];
    selectedFiles1: TreeNode<any>[] | any[] | any;
    colorOptions: any[] = [];
    image: any;
    uploadedImages:any[]=[]
    continueSave:any
    loading: boolean = false;
    // selectTab: boolean = true;
    disableTab: boolean = false;
    ImageVariation:boolean = false;
    seletedTab:number=0
    marques:Marque[] =[]
    attributs:Attribut[]=[]
    categories:Categorie[]=[]
    selectedAttribut:Attribut={
        nom:'',
        attribut_values:[],
        visible:false
    }
    oldselectedAttribut:Attribut={
        nom:'',
        attribut_values:[],
        visible:false
    }
    AttributValues:ValAttribut[]=[]
    selectedColors:any[] = []
    oldCouleur:any[] = []
    selectedTd: { val: ValAttribut, color: any }[] = [];
    selectedTdUpdate: { val: ValAttribut, color: any }[] = [];
    oldsselectedTd: { val: any, color: any }[] = [];

    variation:any[]=[]
    previousMyVar:any[]=[]
    menuItems: MenuItem[] = [];
    menuItemsCouleurVariation: MenuItem[] = [];
    // Article:article={
    //     nom_article:'',
    //     reference:'',
    //     description:'',
    //     prix_achat:null,
    // }
    Article: article = {
        nom_article: '',
        reference: '',
        description: '',
        prix_achat: 0,
        images: [],
        image:null,
        remise: 0,
        prix_vente: 0,
        couleurs: [],
        attribut: null,
        marque: null,
        categories: [],
        variations: [],
        activer: true,
        qte_Total: 0,
        balise_titre: "",
        meta_desc: "",
        url_simp: "",
        dimensionner: true,
        couleur_image: [],
        articleAssicie: [],
        publier: false,
        meta_motsCle: "",
    };
     updateArticle:any
     oldArticle :article = {
        ...this.Article
    };
    articleChange: Record<keyof article, boolean> = Object.keys(this.Article).reduce((acc, key) => {
        acc[key as keyof article] = false;
        return acc;
    }, {} as Record<keyof article, boolean>);
    VariationsArray:any[]=[]
    articleAssicie:any[]=[]
    oldMarque:any
    items:any[] = [];
    selectedItems!: any[];

    selectAll = false;
    variationToUpdate:any
    CategorieChips:string[]= [];
    VariationCouleurImage:any
    disableSave:boolean = false;

    constructor(private nodeService: NodeService,private marqueService: MarqueService,
        private categoryService: CategorieService,private attributService:AttributService,
        private categorieService:CategorieService,private couleurService:CouleurService,private messageService: MessageService,
        private imageService:ImageService,private cdRef: ChangeDetectorRef,private articleService:ArticleService,private route: ActivatedRoute
       ) {
        this.nodeService.getFiles().then((files) => (this.nodes = files));

    }

   async  ngOnInit() {


    this.route.queryParams.subscribe(params => {
        // Access the query parameters here
        const id = params['id'];
        console.log('id article to update',id);
        this.articleService.getArticleById(id).then((article) => {console.log('article to update',article)})
        .catch((error) => {console.log(error)})
        // Use the data as needed
    });


  await this.articleService.getArticles().then((articles) =>{console.log(articles)
    this.articleAssicie=articles.articles
    // console.log(articles)
})
    // console.log(this.Article.articleAssicie)

        // this.Article.dimensionner=true
    await    this.nodeService.getFiles().then((files) => {(
            this.files1 = files)
            console.log(files)
        });

        await   this.marqueService.getMarques().then((data:any) =>
        { this.marques = data.marques
         console.log('Marques:', this.marques)
         });

         await  this.attributService.getAttributs().then((data:any) =>
         { this.attributs = data.attribut
          console.log('Attributs:', this.attributs)
          });



          await  this.couleurService.getCouleurs().then((data:any) => {
            console.log('Couleurs:', data)
            this.colorOptions=data.attribut
            .map((item:any)=>({id:item.id,name:item.valeur,background:item.code_hexa}))
            console.log(this.colorOptions)
        })

        await this.categorieService.getOrdredCategories().then((data: any) => {
            let parentCounter = 0;

            console.log('Categorie:', data);
            this.categories = data.map((item: any) => {
                let itemKey = String(parentCounter++);
                let childCounter = 0;

                return {
                    key: itemKey,
                    label: item.parent1.nom,
                    id:item.parent1.id,
                    children: item.children1.map((child: any) => {
                        let childKey = `${itemKey}-${childCounter++}`;

                        return {
                            key: childKey,
                            label: child.parent2.nom,
                            id:child.parent2.id,

                            children: child.children2.map((underChild: any) => {
                                let underChildKey = `${childKey}-${childCounter++}`;

                                return {
                                    key: underChildKey,
                                    label: underChild.parent3.nom,
                                    id: underChild.parent3.id
                                };
                            })
                        };
                    })
                };
            });
            console.log('Categorie:', this.categories);
        });


        this.menuItems = [

            {
                label: 'Modifier',
                icon: 'pi pi-pencil',
                command: () =>    this.DialogVariation.showDialog(this.variationToUpdate)
                // routerLink:'/attribut/ajouter-couleur'
            },
            {
                label: 'Supprimer',
                icon: 'pi pi-fw pi-trash',
                // command: () =>    this.DialogVariation.showDialog(this.variationToUpdate)
            },
        ]

        this.menuItemsCouleurVariation= [
            {
                label: 'Images',
                icon: 'pi pi-plus',
                command: () => this.AjouterImages('Variation',this.VariationCouleurImage,this.imageService.getColImages())
                // routerLink:'/attribut/ajouter-couleur'
            },
            {
                label: 'Modifier',
                icon: 'pi pi-pencil',
                // command: () =>    this.DialogVariation.showDialog(this.variationToUpdate)
                // routerLink:'/attribut/ajouter-couleur'
            },
            {
                label: 'Supprimer',
                icon: 'pi pi-fw pi-trash',
                // command: () =>    this.DialogVariation.showDialog(this.variationToUpdate)
            },
        ]

        console.log(this.imageService.getImagePrin())
        if(this.imageService.getImagePrin()){
            localStorage.removeItem('imagePrin');

        }
        console.log(this.imageService.getImagePrinVariation())

        if(this.imageService.getImagePrinVariation() !== null){
            localStorage.removeItem('imagePrinVariation');

        }
        console.log(this.imageService.getColImages())

        if(this.imageService.getColImages().length>0){
            localStorage.removeItem('colImages');

        }


    }
    // getLabels(nodes: any[]): string[] {
    //     return nodes.flatMap((node: any) => {
    //         const labels: string[] = []; // Initialize an empty array for labels

    //         // Add the label of the current node
    //         labels.push(node.label);

    //         // If there are children, concatenate their labels
    //         if (node.children && node.children.length > 0) {
    //             const childLabels = node.children.map((child: any) => child.label);
    //             labels.push(...childLabels); // Concatenate child labels to the parent label
    //         }

    //         return labels;
    //     });
    // }

    menuOnShow(data:any){
        console.log(data)
        this.VariationCouleurImage=data.couleur_image
    }

    onNodeSelect(event:any){
    console.log(event.node)

    console.log(this.selectedFiles1)
    console.log(this.oldArticle.categories)
    if(this.idArticle){
        const findCateg = this.selectedFiles1.some((category:any) => {
            return !this.oldArticle.categories.some((oldCategory:any) => oldCategory.id === category.id);
        });
        console.log(findCateg)

        if(findCateg){
          this.articleChange.categories=true
          this.disableSave=false
          console.log(this.articleChange)



        } else{
            this.articleChange.categories=false

        }

    }

    this.CategorieChips = this.selectedFiles1.flatMap((file: any) => {
        const labels: string[] = [file.label];

        if (file.children && file.children.length > 0) {
            // If there are children, add their labels to the labels array
            const childLabels = file.children.map((child: any) => child.label);
            // console.log(childLabels)
            labels.concat(childLabels);
        }

        return labels;
    });


    console.log(this.CategorieChips);

    this.Article.categories=this.selectedFiles1.map((item:any) => item.id);

    }


    RemoveCateg(event:any){
        if(event){
            console.log(this.Article.categories);
            console.log(typeof event.value);
            const value = event.value;

            const categ=  this.selectedFiles1.find((category:any)=>category.label==value)
            console.log(categ)
            if(categ) {
                const categIndex=  this.selectedFiles1.findIndex((category:any)=>category.label==value)
                console.log('Index:', categIndex);
                this.selectedFiles1.splice(categIndex, 1);
            }
        }
    }


    UnselectCateg(event: any) {


        if(this.idArticle){
            const findCateg = this.selectedFiles1.some((category:any) => {
                return !this.oldArticle.categories.some((oldCategory:any) => oldCategory.id === category.id);
            });
            console.log(findCateg)

            if(findCateg){
              this.articleChange.categories=true
              this.disableSave=false
              console.log(this.articleChange)



            } else{
                this.articleChange.categories=false

            }

        }


        console.log('Before splice:', this.CategorieChips);
        const index = this.CategorieChips.findIndex((c: string) => c.toLowerCase() === event.node.label.toLowerCase());
        console.log('Index:', index);
        if (index !== -1) {
            this.CategorieChips.splice(index, 1);
            this.CategorieChips=Object.assign([],this.CategorieChips);
            // this.onChangeChips(event);

        }
        console.log('After splice:', this.CategorieChips);
    }
    onChangeChips(event:any){
        console.log(event);
        this.cdRef.detectChanges();

        // this.CategorieChips.splice(index, 1);

    }
    // *******************************************color************************************************************


    onColorSelect(color: any) {
        // this.selectedColors.indexOf(color) == -1 ? this.selectedColors.push(color) : this.selectedColors.splice(this.colors.indexOf(color), 1);
        console.log(color)
        console.log(this.articleChange)

        console.log('oldCouleur',this.oldCouleur,'selectedColors',this.selectedColors)

        if(this.idArticle){
            this.disableSave=false
            console.log(this.idArticle)
            const index = this.selectedColors.findIndex((item: any) => item.id === color.id);
            console.log(this.selectedTd,);
            // this.selectedTd=[]
            // =[]
            console.log('all selected td',this.selectedTd,'selected td to update',this.selectedTdUpdate,'old selected td ',this.oldsselectedTd);
            this.articleChange.couleurs=true;
            this.articleChange.variations=true

            if(this.VariationsArray.length >0){

                console.log('senario update avec variation creer en avance ')

                if (index === -1) {
                    this.selectedColors.push(color);
                    if(this.selectedColors.length==1 && this.AttributValues.length>0){
                        this.selectedTd = this.AttributValues.flatMap(val =>
                            this.selectedColors.map(selectedColor => ({ val, color: selectedColor }))
                        );
                        this.selectedTdUpdate= this.AttributValues.flatMap(val =>
                            this.selectedColors.map(selectedColor => ({ val, color: selectedColor }))
                        );
                        console.log('all selected td',this.selectedTd,'selected td to update',this.selectedTdUpdate,'old selected td ',this.oldsselectedTd);
                        this.loadCustomers()
                    }else{
                        console.log(this.selectedTd,this.oldselectedAttribut);
                        let newTd = this.AttributValues.map(val => ({ val, color: color }));
                        this.selectedTd.push(...newTd);
                        this.selectedTdUpdate.push(...newTd);

                        console.log('all selected td',this.selectedTd,'selected td to update',this.selectedTdUpdate,'old selected td ',this.oldsselectedTd);

                    }
                } else {

                console.log('slected  color',color)
                 let existColor=this.oldCouleur.find(oldColor =>oldColor.name==color.name)
                 console.log('find the color in old color ',existColor)

                 if(existColor){
                    this.messageService.add({severity: 'info', summary: 'Info', detail: 'impossible de déselecter ce couleur .' });

                 }
                 else{
                    console.log('selectedtd before splice',this.selectedTd)
                    this.selectedColors.splice(index, 1);
                    // Remove the color from couleur_image if it exists
                    this.selectedTd = this.selectedTd.filter(item => item.color.name !== color.name);
                    this.selectedTdUpdate = this.selectedTdUpdate.filter(item => item.color.name !== color.name);


                    const couleurIndex = this.Article.couleur_image.findIndex((item: any) => item.attribut_value === color.id);
                    if (couleurIndex !== -1) {
                        this.Article.couleur_image.splice(couleurIndex, 1);
                    }
                    console.log('selectedtd after splice',this.selectedTd,'selected td to update',this.selectedTdUpdate,'old selected td ',this.oldsselectedTd)
                    console.log('Sselected colors',this.selectedColors,'old selected colors   ',this.oldCouleur)
                    console.log(this.articleChange)


                    this.articleChange.couleurs=false;
                    this.articleChange.variations=false
                }

                }


                const newColorIds = this.selectedColors
                .filter(selectedColor =>
                    !this.oldCouleur.some(oldColor => oldColor.id === selectedColor.id)
                )
                .map(newColor => newColor.id);
                this.Article.couleurs=newColorIds
                console.log('couleur',  this.Article.couleurs)

            }else{
            console.log('senario update sans variation crer en avance ')
            this.articleChange.couleurs=true;
            const index = this.selectedColors.findIndex((item: any) => item.id === color.id);
            if (index === -1) {
                this.selectedColors.push(color);
                if(this.selectedColors.length==1 && this.AttributValues.length>0){
                    this.selectedTd = this.AttributValues.flatMap(val =>
                        this.selectedColors.map(selectedColor => ({ val, color: selectedColor }))
                    );
                    //  = [...this.selectedTd];
                    console.log(this.selectedTd);
                    this.loadCustomers()
                }else{
                    console.log(this.selectedTd,);
                    let newTd = this.AttributValues.map(val => ({ val, color: color }));
                    this.selectedTd.push(...newTd);

                    console.log(this.selectedTd,);

                }
            } else {
                console.log('selectedtd before splice',this.selectedTd)
                this.selectedColors.splice(index, 1);
                // Remove the color from couleur_image if it exists
                this.selectedTd = this.selectedTd.filter(item => item.color.name !== color.name);

                const couleurIndex = this.Article.couleur_image.findIndex((item: any) => item.attribut_value === color.id);
                if (couleurIndex !== -1) {
                    this.Article.couleur_image.splice(couleurIndex, 1);
                }
                console.log('selectedtd after splice',this.selectedTd)

            }

            this.Article.couleurs=this.selectedColors.map((item:any) => item.id);
            console.log('couleur',  this.Article.couleurs)

            }

        }else{
            const index = this.selectedColors.findIndex((item: any) => item.id === color.id);
            if (index === -1) {
                this.selectedColors.push(color);
                if(this.selectedColors.length==1 && this.AttributValues.length>0){
                    this.selectedTd = this.AttributValues.flatMap(val =>
                        this.selectedColors.map(selectedColor => ({ val, color: selectedColor }))
                    );
                    console.log(this.selectedTd);
                    this.loadCustomers()
                }else{
                    console.log(this.selectedTd,);
                    let newTd = this.AttributValues.map(val => ({ val, color: color }));
                    this.selectedTd.push(...newTd);

                    console.log(this.selectedTd,);

                }
            } else {
                console.log('selectedtd before splice',this.selectedTd)
                this.selectedColors.splice(index, 1);
                // Remove the color from couleur_image if it exists
                this.selectedTd = this.selectedTd.filter(item => item.color.name !== color.name);

                const couleurIndex = this.Article.couleur_image.findIndex((item: any) => item.attribut_value === color.id);
                if (couleurIndex !== -1) {
                    this.Article.couleur_image.splice(couleurIndex, 1);
                }
                console.log('selectedtd after splice',this.selectedTd)

            }
            console.log(this.selectedColors);
            console.log(this.Article.couleur_image);

            this.Article.couleurs=this.selectedColors.map((item:any) => item.id);
            console.log('couleur',  this.Article.couleurs)

            console.log(this.AttributValues);
        }



        // if(this.selectedColors.length>0 && this.AttributValues.length>0){
        //     this.selectedTd = this.AttributValues.flatMap(val =>
        //         this.selectedColors.map(selectedColor => ({ val, color: selectedColor }))
        //     );

        //     console.log(this.selectedTd);
        //     this.loadCustomers()
        // }

    }

    // *****************************************file upload**************************************************************

    onUpload(event: any) {
    //    const image=event.originalEvent.body[0].id
       console.log(event)

        for (let file of event.files) {
            this.images.push(file);
        }
      let newImages=event.originalEvent.body.map((file:any) =>({
            id:file.id.toString(),
            imageUrl:file.formats.thumbnail.url  ? "http://192.168.0.245" + file.formats.thumbnail.url: ""
        }))
        console.log(newImages)
        this.imageService.saveAllImages(newImages)
        const imageIds = newImages.map((image:any) => image.id);
        console.log(imageIds)
        if (this.Article.images && this.Article.images.length > 0) {
            this.Article.images = this.Article.images.concat(imageIds);
            console.log(this.Article.images);
        } else {
            this.Article.images = imageIds;
            console.log(this.Article.images);
        }


        this.changed=true

        const imageToUpdateIndex = this.imageService.staticList.data.findIndex((image: any) => image.listId === "1");
        if (imageToUpdateIndex !== -1) {
        // Update the cards property of the found image
        this.imageService.staticList.data[imageToUpdateIndex].cards.push(...newImages);
                console.log(  this.imageService.staticList)

        // Update the entire list in the service (optional, if required)
        this.imageService.updateLists(this.imageService.staticList.data);


          this.imageService.lists$.subscribe((data) => {
            console.log(data)
            this.changedListParent=data

        });
        }

        if(this.idArticle){
            const isNewImageSelected = this.Article.images.some((imageId:any) => !this.oldArticle.images.includes(imageId));

            console.log(isNewImageSelected);
            if(isNewImageSelected){
                this.articleChange.images=true
                this.disableSave=false
            }
            console.log(this.articleChange)
        }


    }


    onImageMouseOver(file: Image) {
        this.buttonEl.toArray().forEach((el) => {
            el.nativeElement.id === file.name ? (el.nativeElement.style.display = 'flex') : null;
        });
    }

    onImageMouseLeave(file: Image) {
        this.buttonEl.toArray().forEach((el) => {
            el.nativeElement.id === file.name ? (el.nativeElement.style.display = 'none') : null;
        });
    }
    removeImage(file?: Image) {
        if(file){
            this.images = this.images.filter((i) => i !== file);

        }
        else{
            this.image = null;
        }
    }

    // removeImage() {
    //     this.image = null;
    // }

    // *******************************************************************************************************
    AttributChanged(event:any){
        console.log(event)
        if(this.idArticle){
            this.disableSave=false

                // update case

            if(this.VariationsArray.length== 0){

             if(this.oldArticle.attribut?.id!=event.value.id){
                console.log('attribut changed')
                this.articleChange.attribut=true;
                this.disableSave=false
             }



                console.log(this.selectedAttribut,this.oldselectedAttribut)
                console.log(this.selectedTd,this.selectedTd);

                console.log(this.selectedAttribut)

                if(this.oldselectedAttribut.nom!==this.selectedAttribut.nom && this.selectedAttribut.nom!==''  && this.oldselectedAttribut.nom!==''){
                   console.log('test')

                   this.selectedTd=[]
                   this.Article.attribut = this.selectedAttribut.id
                   if(this.selectedAttribut.attribut_values && this.selectedAttribut.attribut_values.length > 0){
                       this.AttributValues=this.selectedAttribut.attribut_values
                       console.log(this.AttributValues)


                   }
                   if(this.AttributValues.length>0 && this.selectedColors.length>0){
                       this.selectedTd = this.AttributValues.flatMap(val =>
                           this.selectedColors.map(selectedColor => ({ val, color: selectedColor }))
                       );
                   }
                }
                else{
                    this.Article.attribut = this.selectedAttribut.id
                    if(this.selectedAttribut.attribut_values && this.selectedAttribut.attribut_values.length > 0){
                        this.AttributValues=this.selectedAttribut.attribut_values
                        console.log(this.AttributValues)


                    }
                    if(this.AttributValues.length>0 && this.selectedColors.length>0){
                        this.selectedTd = this.AttributValues.flatMap(val =>
                            this.selectedColors.map(selectedColor => ({ val, color: selectedColor }))
                        );

                        console.log(this.selectedTd);
                        // this.updateVariation()
                        this.loadCustomers()
                    }
                }

                this.oldselectedAttribut=this.selectedAttribut
                console.log(this.selectedTd,this.selectedTd);

            }

        }
        else{
            // create case
            console.log(this.selectedAttribut,this.oldselectedAttribut)
            console.log(this.selectedTd,this.selectedTd);

            console.log(this.selectedAttribut)

            if(this.oldselectedAttribut.nom!==this.selectedAttribut.nom && this.selectedAttribut.nom!==''  && this.oldselectedAttribut.nom!==''){
               console.log('test')

               this.selectedTd=[]
               this.Article.attribut = this.selectedAttribut.id
               if(this.selectedAttribut.attribut_values && this.selectedAttribut.attribut_values.length > 0){
                   this.AttributValues=this.selectedAttribut.attribut_values
                   console.log(this.AttributValues)


               }
               if(this.AttributValues.length>0 && this.selectedColors.length>0){
                   this.selectedTd = this.AttributValues.flatMap(val =>
                       this.selectedColors.map(selectedColor => ({ val, color: selectedColor }))
                   );
               }
            }
            else{
                this.Article.attribut = this.selectedAttribut.id
                if(this.selectedAttribut.attribut_values && this.selectedAttribut.attribut_values.length > 0){
                    this.AttributValues=this.selectedAttribut.attribut_values
                    console.log(this.AttributValues)


                }
                if(this.AttributValues.length>0 && this.selectedColors.length>0){
                    this.selectedTd = this.AttributValues.flatMap(val =>
                        this.selectedColors.map(selectedColor => ({ val, color: selectedColor }))
                    );

                    console.log(this.selectedTd);
                    // this.updateVariation()
                    this.loadCustomers()
                }
            }

            this.oldselectedAttribut=this.selectedAttribut
            console.log(this.selectedTd,'oldseletedtd',this.selectedTd);


        }


    }

    // *******************************************************************************************************


    async onTdClick(event: Event, val: any, color: string) {
        console.log(val,color,'all selected td',this.selectedTd,'old selected td',this.oldsselectedTd)

        if(this.idArticle){
            const index=this.oldsselectedTd.findIndex(td => td.val === val && td.color === color);

            if (index !== -1) {
                this.messageService.add({severity: 'info', summary: 'Info', detail: 'impossible de déselecter cette variation .' });


                console.log(val, color, this.selectedTd,this.variation,this.oldsselectedTd);

              } else {
                this.articleChange.variations=true;
                const index = this.selectedTd.findIndex(td => td.val === val && td.color === color);
                const indexUddate = this.selectedTdUpdate.findIndex(td => td.val === val && td.color === color);


                if (index !== -1) {
                    console.log('splice variation')

                    await    this.selectedTd.splice(index, 1);
                  await    this.selectedTdUpdate.splice(indexUddate, 1);
                //   console.log(val,color,'selected td',this.selectedTd,'selected td to update',this.selectedTdUpdate)
               await   this.loadCustomers()



                  console.log(val, color,this.variation,'selected td',this.selectedTd,'selected td to update',this.selectedTdUpdate);

                } else {
                    console.log('add variation')

                    await   this.selectedTd.push({ val, color });
                    await   this.selectedTdUpdate.push({ val, color });

                  console.log(val,color,this.selectedTd)
                  console.log('selected td',this.selectedTd,'selected td to update',this.selectedTdUpdate)
               await  this.loadCustomers()

                }

              }

        }
        else{
            const index = this.selectedTd.findIndex(td => td.val === val && td.color === color);

            if (index !== -1) {
            await  this.selectedTd.splice(index, 1);
              console.log(val,color,this.selectedTd)
             await this.loadCustomers()



              console.log(val, color, this.selectedTd,this.variation);

            } else {
                await   this.selectedTd.push({ val, color });
              console.log(val,color,this.selectedTd)
              console.log('selected Variation',this.selectedTd)
              await this.loadCustomers()



            }
        }
      }

      isSelectedTd(val: any, color: string): boolean {
        // console.log(this.selectedTd.some(td => td.val === val && td.color === color))
        return this.selectedTd.some(td => td.val === val && td.color === color);
      }


      // Define a method to update the variation array
async updateVariation() {
    if(this.idArticle){
        console.log('selectedtd',this.selectedTd,'selectedtd to update ',this.selectedTdUpdate)
       if( this.selectedTdUpdate.length>0 && this.selectedTd.length>0){
                // cas update avec variation creer en avance

        const uniqueColors = [...new Set(this.selectedTdUpdate.map(item => item.color.id))];

        this.variation= uniqueColors.map(colorId => {
        const colorItem = this.selectedTdUpdate.find(item => item.color.id === colorId);

        if (colorItem) {
            const color = colorItem.color;

            const vals = this.selectedTdUpdate
                .filter(item => item.color.id === colorId)
                .map(item => ({
                    // ...item.val,
                    couleur:color,
                    attribut_value:{id:item.val.id,valeur:item.val.valeur},
                    stock: 0,
                    images: [],
                    prix_achat: 0,
                    prix_vente: 0,
                    activer: false,
                    article :this.Article.nom_article
                }));

            // let article = this.Article.nom_article;

            return { color, vals };
        } else {
            return null;
        }
    }).filter(item => item !== null);
       }

    else

     if( this.selectedTdUpdate.length==0 && this.selectedTd.length>0 &&
        this.selectedTd.some(selectedItem =>
            !this.oldsselectedTd.some(oldItem =>
                oldItem.val.id === selectedItem.val.id && oldItem.color.id === selectedItem.color.id
            )
        )) {
        // cas update sans variation creer en avance ou avec variation en avance avec nouveau couleur mais sans nouveau variation
        console.log(this.selectedTd,'testtt')
        const uniqueColors = [...new Set(this.selectedTd.map(item => item.color.id))];

        this.variation= uniqueColors.map(colorId => {
        const colorItem = this.selectedTd.find(item => item.color.id === colorId);

        if (colorItem) {
            const color = colorItem.color;

            const vals = this.selectedTd
                .filter(item => item.color.id === colorId)
                .map(item => ({
                    // ...item.val,
                    couleur:color,
                    attribut_value:{id:item.val.id,valeur:item.val.valeur},
                    stock: 0,
                    images: [],
                    prix_achat: 0,
                    prix_vente: 0,
                    activer: false,
                    article :this.Article.nom_article
                }));

            // let article = this.Article.nom_article;

            return { color, vals };
        } else {
            return null;
        }
    }).filter(item => item !== null);
       }
       else{
        this.variation=[]
       }


      console.log(this.variation)
    }
    else{
        const uniqueColors = [...new Set(this.selectedTd.map(item => item.color.id))];

        this.variation= uniqueColors.map(colorId => {
        const colorItem = this.selectedTd.find(item => item.color.id === colorId);

        if (colorItem) {
            const color = colorItem.color;

            const vals = this.selectedTd
                .filter(item => item.color.id === colorId)
                .map(item => ({
                    // ...item.val,
                    couleur:color,
                    attribut_value:{id:item.val.id,valeur:item.val.valeur},
                    stock: 0,
                    images: [],
                    prix_achat: 0,
                    prix_vente: 0,
                    activer: false,
                    article :this.Article.nom_article
                }));

            // let article = this.Article.nom_article;

            return { color, vals };
        } else {
            return null;
        }
    }).filter(item => item !== null);

    }


console.log(this.variation);

this.cdRef.detectChanges();

}


    // *******************************************************************************************************

    loadCustomers(event?: TableLazyLoadEvent) {
        this.loading = true;

            this.updateVariation()

            this.loading = false;

    }
    // *******************************************************************************************************
    async AjouterImages(field?:any,data?:any,data1?:any){
        console.log(data1)
        this.uploadImages=true
        if(this.Article.images.length > 0){
            if(this.imageService.getImagePrin() && field =='Article'){
             data=this.imageService.getImagePrin()
            }

      await  this.ImageDialog.showDialog(field,data,data1)
       }
       else{
        this.messageService.add({severity: 'info', summary: 'Info', detail: 'selectionner image(s).' });
        this.uploadImages=false

       }
    }
        // *******************************************************************************************************

        onSelectAllChange(event:any) {
            this.selectedItems = event.checked ? [...this.items] : [];
            this.selectAll = event.checked;
            event.updateModel(this.selectedItems, event.originalEvent)
            // console.log('article assiciés',this.selectedItems)
        }

        onChange(event:any) {
            const { originalEvent, value } = event
            if(value) this.selectAll = value.length === this.items.length;
            // console.log('article assiciés',this.selectedItems)
           this.Article.articleAssicie= this.selectedItems.map(item => item.id)
           console.log('article assiciés', this.Article.articleAssicie)


           if(this.idArticle){
            console.log('article assiciés',this.Article.articleAssicie,'old article assiciés',this.oldArticle.articleAssicie)
            const isNewArticlesSelected = this.Article.articleAssicie.some((article:any) => !this.oldArticle.articleAssicie.includes(article));
            if(isNewArticlesSelected || (this.oldArticle.articleAssicie.length === 0 && this.Article.articleAssicie.length>0)){
               this.articleChange.articleAssicie=true
               this.disableSave=false
            }
           }

        }
         // *******************************************************************************************************
         updateVariationData(val:any){
            console.log(val)
            this.variationToUpdate=val
         }

        // *******************************************************************************************************
        receiveVariationFromChild(data:any){
            console.log('Data received from child:', data);
            console.log(this.VariationsArray)


                        // Loop through the variation array to find the item with matching couleur.id
            let matchingColorItem = this.VariationsArray.find(item => item.color.id === data.couleur.id);

            if (matchingColorItem) {
            // If a matching color is found, filter the vals array to find the item with matching attribut_value.id
            let matchingAttributValue = matchingColorItem.vals.find((val:any) => val.attribut_value.id === data.attribut_value.id);
            let matchingIndex = matchingColorItem.vals.findIndex((val: any) => val.attribut_value.id === data.attribut_value.id);

            if (matchingIndex !== -1) {
                // If a matching attribut_value is found, splice it and replace it with the new data
                matchingColorItem.vals.splice(matchingIndex, 1, data);}
            if (matchingAttributValue) {
                // If a matching attribut_value is found, do something with it
                console.log('Matching attribut_value:', matchingAttributValue);
                matchingAttributValue=data
                console.log(matchingAttributValue)
                console.log(this.VariationsArray)


            } else {
                console.log('No matching attribut_value found for the given couleur.id and attribut_value.id');
            }
            } else {
            console.log('No matching color found for the given couleur.id');
            }

        }
        // *******************************************************************************************************

    async    Sauvegarder(){
            this.submitted=true


                switch (true) {
                    case !this.Article.nom_article.trim():
                        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Nom Article est obligatoire.' });
                        // this.submitted=false
                        break;
                    case !this.Article.reference.trim():
                        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Réference est obligatoire' });
                        // this.submitted=false

                        break;
                    case !this.Article.description.trim():
                        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Description est obligatoire.' });
                        // this.submitted=false

                        break;
                    case this.Article.prix_achat === 0 || this.Article.prix_achat === undefined || this.Article.prix_achat === null:
                            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Prix Initiale est obligatoire.' });
                            // this.submitted=false

                        break;
                        case this.Article.prix_vente === 0 || this.Article.prix_vente === undefined || this.Article.prix_vente === null:
                            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Prix de Vente est obligatoire.' });
                            // this.submitted=false

                        break;
                    default:
                        console.log('Default case');
                        console.log(this.selectedTd,this.selectedTd.length);
                        // update article
                        if(this.idArticle){
                            console.log('changes',this.articleChange)

                            console.log("update article")
                            console.log('old article',this.oldArticle,'new article',this.Article,'selectedtd',this.selectedTd)
                            // UPDATE AVEC VARIATION
                            // if(this.selectedTd.length > 0){
                            if(this.articleChange.variations==true){

                                console.log('variationchanged',this.articleChange.variations)
                                this.ConfirmDialog=true

                            }
                            // UPDATE SANS VARIATION
                            else{

                                console.log(this.articleChange)
                                const hasChanged = Object.values(this.articleChange).some(value => value === true);

                            if (hasChanged) {


                    // const updatedData: Partial<article> = Object.keys(this.articleChange)
                    // .filter(key => this.articleChange[key as keyof article]) // Filter keys with true values
                    // .reduce((acc, key) => {
                    //     acc[key as keyof article] = this.Article[key as keyof article];
                    //     return acc;
                    // }, {} as Partial<article>);

                                const updatedData: Partial<article> = Object.keys(this.articleChange)
                .reduce((acc, key) => {
                    if (Array.isArray(this.Article[key as keyof article])) {
                        // If the property is an array
                        if (this.articleChange[key as keyof article]) {
                            // If the value is true, use the current array
                            acc[key as keyof article] = this.Article[key as keyof article];
                        } else {
                            // If the value is false, use an empty array
                            acc[key as keyof article] = [];
                        }
                    } else {
                        // For non-array properties, directly copy the value from Article if it's true
                        if (this.articleChange[key as keyof article]) {
                            acc[key as keyof article] = this.Article[key as keyof article];
                        }
                    }
                    return acc;
                }, {} as Partial<article>);


                    if (this.articleChange.marque) {
                        updatedData.marque = this.Article.marque?.id;
                    }
                        console.log(this.imageService.getImagePrin())
                        // updatedData.image = this.imageService.getImagePrin();


                    console.log(updatedData)


                    this.Article.image=this.imageService.getImagePrin()
                    this.oldCouleur = [...this.selectedColors];
                    this.oldsselectedTd=[...this.selectedTd]
                    this.oldArticle={...this.Article}

                    console.log('article',this.Article)
                    await   this.articleService.updateArticle(updatedData,this.idArticle).then((res) => {
                        console.log(res)
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Article Modifier Avec Succé.' })
                        // this.submitted=false
                        this.disableSave=true
                        // this.selectedTd=[]
                        // Set all properties to false using reduce with explicit typing
                        Object.keys(this.articleChange).reduce((acc, key) => {
                            acc[key as keyof typeof this.articleChange] = false;
                            return acc;
                        }, this.articleChange);

                    })
                    .catch((err) =>
                    {
                    console.log(err)

                    })
                    console.log('old article',this.oldArticle,'new article',this.Article)

                    } else {

                        this.messageService.add({severity: 'error', summary: 'Error', detail: 'au moins une valeur doit etre changer.' });


                    }


                            }


                        }
                        // Create article

                        else{
                            // create avec variation
                            if(this.selectedTd.length>0){

                                this.ConfirmDialog=true
                        }
                            // create sans variation
                        else{
                                    if(this.selectedColors.length>0){
                                        this.Article.couleur_image=this.selectedColors.map((item:any)=>({
                                            attribut_value:item.id
                                        }))
                                    }

                                    this.Article.marque= this.Article.marque?.id

                                    this.Article.image=this.imageService.getImagePrin()
                                    this.oldCouleur = [...this.selectedColors];
                                    this.oldsselectedTd=[...this.selectedTd]
                                    this.oldArticle={...this.Article}

                                    console.log('article',this.Article)

                                  await  this.articleService.postArticle(this.Article).then(res=>{

                                        console.log(res)
                                        this.disableSave=true
                                        this.idArticle=res.id
                                        this.submitted=false
                                        this.update=true
                                        this.Article.marque= this.oldMarque
                                        this.VariationsArray=res.couleur_images.map((item:any)=>({
                                            color:{id:item.attribut_value.id,name:item.attribut_value.valeur,background:item.attribut_value.code_hexa},
                                            couleur_image:item.attribut_value,
                                            vals:[]

                                        }))


                                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Article Créer Avec Succé.' })




                                    }).catch(error=>{console.log("Error creating article",error)});
                                    // console.log('updated Article(reponse Api)',this.updateArticle)
                                    console.log('oldArticle',this.oldArticle)

                            }
                        }


                        break;
                }


    }
        // *******************************************************************************************************


  async  saveArticle(){
    this.submitted=true
// update article
    if(this.idArticle){
     let updatedData:Partial<article> = {};
    if(this.articleChange.variations){
        // if(this.selectedTdUpdate.length>0 && this.selectedTd.length>0){

        console.log(this.articleChange)
        const hasChanged = Object.values(this.articleChange).some(value => value === true);

        if (hasChanged) {


        //     const updatedData: Partial<article> = Object.keys(this.articleChange)
        //     .filter(key => this.articleChange[key as keyof article] || key === 'variations') // Include 'variations' key
        //     .reduce((acc, key) => {
        //         if (key === 'variations') {

        // this.Article.variations = this.variation.flatMap((item: any) => (
        //     item.vals.map((val: any) => ({
        //         stock: val.stock,
        //         prix_achat: val.prix_achat,
        //         prix_vente: val.prix_vente,
        //         attribut_value: val.attribut_value.id,
        //         activer: val.activer,
        //         couleur: item.color ? item.color.id : null // Add a check for item.color
        //     }))
        // ));

        //                 acc[key as keyof article] =this.Article.variations;
        //             // }
        //         } else if (Array.isArray(this.Article[key as keyof article])) {
        //             // If the property is an array and articleChange has it set to false
        //             acc[key as keyof article] = this.articleChange[key as keyof article] ? this.Article[key as keyof article] : [];
        //         }  else  {
        //             acc[key as keyof article] = this.Article[key as keyof article];
        //         }
        //         return acc;
        //     }, {} as Partial<article>);
        const updatedData: Partial<article> = Object.keys(this.articleChange)
    .filter(key => {
        // Include 'variations' key or properties with true values or arrays with false values in articleChange
        if (key === 'variations') {
            return true; // Include variations unconditionally
        } else if (Array.isArray(this.Article[key as keyof article])) {
            return this.articleChange[key as keyof article] || this.Article[key as keyof article].length > 0;
        } else {
            return this.articleChange[key as keyof article];
        }
    })
    .reduce((acc, key) => {
        if (key === 'variations') {
            // Process variations array
            this.Article.variations = this.variation.flatMap((item: any) => (
                item.vals.map((val: any) => ({
                    stock: val.stock,
                    prix_achat: val.prix_achat,
                    prix_vente: val.prix_vente,
                    attribut_value: val.attribut_value.id,
                    activer: val.activer,
                    couleur: item.color ? item.color.id : null // Add a check for item.color
                }))
            ));
            acc[key as keyof article] = this.Article.variations;
        } else {
            // Handle other properties
            acc[key as keyof article] = this.Article[key as keyof article];
        }
        return acc;
    }, {} as Partial<article>);


       console.log(updatedData.couleurs)
        if (this.articleChange.marque) {
            updatedData.marque = this.Article.marque?.id;
        }
            console.log(this.imageService.getImagePrin())
            // updatedData.image = this.imageService.getImagePrin();
        if(updatedData.couleurs.length>0){
            {
                console.log(this.oldCouleur.map(color=>color.id))
                let oldColors=this.oldCouleur.map(color=>color.id)
                updatedData.couleurs.push(...oldColors);
            }

        }

        console.log(updatedData)

        this.Article.image=this.imageService.getImagePrin()
        this.oldCouleur = [...this.selectedColors];
        this.oldsselectedTd=[...this.selectedTd]
        this.oldArticle={...this.Article}

        console.log('article',this.Article)
        await   this.articleService.updateArticle(updatedData,this.idArticle).then((res) => {
            console.log(res)
            const variation = res.variations.reduce((acc: any, variation: any) => {
                const color = variation.couleur_image.attribut_value;

                // Check if the color already exists in the accumulator array
                const existingColorIndex = acc.findIndex((item: any) => item.color.id === color.id);

                // If the color doesn't exist, add a new entry to the accumulator array
                if (existingColorIndex === -1) {
                    acc.push({
                        color: {id:color.id,name:color.valeur,background:color.code_hexa},
                        couleur_image:variation.couleur_image,
                        vals: [{
                            id:variation.id,
                            code_barre: variation.code_a_barre,
                            activer: variation.activer,
                            article: res.nom_article,
                            attribut_value: variation.attribut_value,
                            couleur: color,
                            couleur_image: variation.couleur_image,
                            images: variation.couleur_image.col_images ,
                            prix_achat: variation.prix_achat,
                            prix_vente: variation.prix_vente,
                            stock: variation.stock,
                            remise:0
                        }]
                    });
                } else {
                    // If the color already exists, push the values to its existing entry in the accumulator array
                    acc[existingColorIndex].vals.push({
                        id:variation.id,
                        code_barre: variation.code_a_barre,
                        activer: variation.activer,
                        article: res.nom_article,
                        attribut_value: variation.attribut_value,
                        couleur: color,
                        couleur_image: variation.couleur_image,
                        images: variation.couleur_image.col_images,
                        prix_achat: variation.prix_achat,
                        prix_vente: variation.prix_vente,
                        stock: variation.stock,
                        remise:0

                    });
                }

                return acc;
            }, []);

            console.log(variation);
            this.VariationsArray=variation
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Article Modifier Avec Succé.' })
            this.selectedTdUpdate=[]
            // this.submitted=false
            this.disableSave=true
            // Set all properties to false using reduce with explicit typing
            Object.keys(this.articleChange).reduce((acc, key) => {
                acc[key as keyof typeof this.articleChange] = false;
                return acc;
            }, this.articleChange);


        })
        .catch((err) =>
        {
        console.log(err)

        })
        console.log('set article change to false ',this.articleChange,'old article',this.oldArticle,'new article',this.Article)



    }


}

    }
    // create article
    else{
        if(this.selectedColors.length>0){
            this.Article.couleur_image=this.selectedColors.map((item:any)=>({
                attribut_value:item.id
            }))
        }
        console.log('variation',this.variation,this.selectedTd)

        this.Article.marque= this.Article.marque?.id

        this.Article.variations = this.variation.flatMap((item: any) => (
            item.vals.map((val: any) => ({
                stock: val.stock,
                prix_achat: val.prix_achat,
                prix_vente: val.prix_vente,
                attribut_value: val.attribut_value.id,
                activer: val.activer,
                couleur: item.color ? item.color.id : null // Add a check for item.color
            }))
        ));


        this.Article.image=this.imageService.getImagePrin()
        console.log('variation',this.Article.variations)


        console.log('article',this.Article)
        this.oldCouleur = [...this.selectedColors];
        this.oldsselectedTd=[...this.selectedTd]
        this.oldArticle={...this.Article}


    await    this.articleService.postArticle(this.Article).then(res=>{
            console.log(res)
            this.disableSave=true


            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Article Créer Avec Succé.' })
            this.submitted=false
            this.update=true
            this.disableAttribut=true
            this.idArticle=res.id
            // this.updateArticle=res



                const variation = res.variations.reduce((acc: any, variation: any) => {
                    const color = variation.couleur_image.attribut_value;

                    // Check if the color already exists in the accumulator array
                    const existingColorIndex = acc.findIndex((item: any) => item.color.id === color.id);

                    // If the color doesn't exist, add a new entry to the accumulator array
                    if (existingColorIndex === -1) {
                        acc.push({
                            color: {id:color.id,name:color.valeur,background:color.code_hexa},
                            couleur_image:variation.couleur_image,
                            vals: [{
                                id:variation.id,
                                code_barre: variation.code_a_barre,
                                activer: variation.activer,
                                article: res.nom_article,
                                attribut_value: variation.attribut_value,
                                couleur: color,
                                couleur_image: variation.couleur_image,
                                images: variation.couleur_image.col_images ,
                                prix_achat: variation.prix_achat,
                                prix_vente: variation.prix_vente,
                                stock: variation.stock,
                                remise:0
                            }]
                        });
                    } else {
                        // If the color already exists, push the values to its existing entry in the accumulator array
                        acc[existingColorIndex].vals.push({
                            id:variation.id,
                            code_barre: variation.code_a_barre,
                            activer: variation.activer,
                            article: res.nom_article,
                            attribut_value: variation.attribut_value,
                            couleur: color,
                            couleur_image: variation.couleur_image.col_images,
                            images: variation.couleur_image,
                            prix_achat: variation.prix_achat,
                            prix_vente: variation.prix_vente,
                            stock: variation.stock,
                            remise:0

                        });
                    }

                    return acc;
                }, []);

                console.log(variation);
                this.VariationsArray=variation


        }).catch(error=>{console.log("Error creating article",error)});
        // console.log(this.updateArticle)

    }



            this.Article.marque= this.oldMarque



    }
        // *******************************************************************************************************

        onChangeTab(event:any){
        // this.submitted=true
       console.log(event);
       if(event.index!==0 && this.Article.nom_article.trim() && this.Article.reference.trim() && this.Article.description.trim() && this.Article.prix_achat==0 && this.Article.prix_vente==0 ){
        //  if(  )
        //  {

         }
         else{
            // this.selectTab=true
            this.seletedTab=0
            console.log('change');
            // this.disableTab=true

         }
        // }
        }
          // *******************************************************************************************************
          responseConfirm(data:string){
            console.log(data)
            if(data=='Oui'){
                // this.continueSave=true
                this.ConfirmDialog=false
                this.saveArticle()
            }else{
                // this.continueSave=false
                this.ConfirmDialog=false
                // this.saveArticle()



            }
          }
    // *******************************************************************************************************
    changedMarque(event:any){
    console.log(event)
    this.oldMarque=event.value
    if(this.idArticle){
        if(this.oldArticle.marque!==event.value || (!this.oldArticle.marque && this.Article.marque)){
            this.articleChange.marque=true
            this.disableSave=false
            console.log(this.articleChange)
        }else{
            this.articleChange.marque=false

        }
    }
    }
    // *******************************************************************************************************
    changeSwitch(filed:keyof article,event:any){
        console.log(event)


        if(filed=="dimensionner" && !event.checked){
          this.disableTab=true
          this.ImageVariation=true
        }else{
            this.disableTab=false
            this.ImageVariation=false
        }


        if(this.idArticle){
            if(this.oldArticle[filed]!==event.checked){
                this.articleChange[filed]=true
                this.disableSave=false
            }else{
                this.articleChange[filed]=false

              }
            console.log(this.articleChange)

        }
        // this.Article.dimensionner=event.value
    }

        // *******************************************************************************************************
        inputChange(field:keyof article,event:any){
            console.log(field,event.value)
           let  newValue=event.value
            if (field === 'prix_achat' || field === 'remise') {
                const prix_achat = this.Article.prix_achat || 0;
                const remise = this.Article.remise || 0;

                if (remise !== 0) {
                    this.Article.prix_vente = parseFloat((prix_achat * (100 - remise) / 100).toFixed(2));
                } else {
                    // this.Article.prix_vente = parseFloat(prix_achat.toFixed(2));
                    this.Article.prix_vente = prix_achat

                }
            }
            if(this.idArticle){

                if (field === 'remise') {
                    this.articleChange.prix_vente = true; // Set prix_vente to true in articleChange
                }
                if(this.oldArticle[field as keyof article]!==newValue){
                    this.articleChange[field]=true
                    this.disableSave=false

                    console.log('old value',this.oldArticle[field as keyof article],'new value',newValue)
                  }else{
                    this.articleChange[field]=false

                  }
                  console.log(this.articleChange)

              }
        }


        // *******************************************************************************************************
        inputValueChange(field: keyof article,event:any){
            console.log(field,event)

            console.log(this.oldArticle,this.Article)


                if(this.idArticle){

            if(field=="description" && event.htmlValue !== undefined ){
                let  newValue=event.htmlValue
                    if(this.oldArticle[field as keyof article]!==newValue){
                        this.articleChange[field]=true
                        this.disableSave=false

                        console.log('old value',this.oldArticle[field as keyof article],'new value',newValue)
                      }else{
                        this.articleChange[field]=false

                      }

                  }else{

                    let  newValue=event.target.value
                    // if(this.idArticle){
                      if(this.oldArticle[field as keyof article]!==newValue){
                          this.articleChange[field]=true
                          this.disableSave=false

                          console.log('old value',this.oldArticle[field as keyof article],'new value',newValue)
                        }
                        else{
                            this.articleChange[field]=false

                          }
                      }
                      console.log(this.articleChange)

                    }

        }

        // *******************************************************************************************************
        OpenVariationTab(){
            console.log(this.selectedTd,this.oldsselectedTd,this.update,this.submitted,this.VariationsArray,this.selectedColors,this.selectedAttribut)
            const res=this.selectedTd.some(selectedItem =>
                !this.oldsselectedTd.some(oldItem =>
                    oldItem.val.id === selectedItem.val.id && oldItem.color.id === selectedItem.color.id
                ) )
            console.log(res)
            console.log(this.selectedTdUpdate.length>0)


        switch (true) {
            case !this.Article.nom_article.trim() && this.ImageVariation==false:
                this.messageService.add({severity: 'info', summary: 'Info', detail: 'Nom Article manquant.' });
                break;
            case this.selectedTd.length==0 && this.selectedColors.length==0 && this.submitted==false && this.ImageVariation==false:
                    this.messageService.add({severity: 'info', summary: 'Info', detail: 'Choississez un ou plusieurs couleur(s).' });
                break;
            case this.selectedTd.length==0 &&  this.selectedAttribut.nom=="" &&
                this.selectedAttribut.attribut_values.length === 0 &&
                !this.selectedAttribut.visible && this.submitted==false && this.ImageVariation==false:
                    this.messageService.add({severity: 'info', summary: 'Info', detail: 'Choississez un Attribut.' });
                break;
            case this.selectedTd.length>0  && this.submitted==false && this.update==false && this.ImageVariation==false:
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Sauvegarder avant' });
                break;
                case (this.update && (
                    this.selectedTd.some(selectedItem =>
                        !this.oldsselectedTd.some(oldItem =>
                            oldItem.val.id === selectedItem.val.id && oldItem.color.id === selectedItem.color.id
                        )
                    ) || this.selectedTdUpdate.length > 0)
                ) && this.ImageVariation==false:
                    this.submitted = false;
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Sauvegarder avant' });
                    break;

            default:
               break
        }

}
        // *******************************************************************************************************
    onReceiveData(data:any){
        console.log(this.VariationsArray);
        console.log(data);
        // this.VariationsArray = this.VariationsArray.map(variation => ({
        //     ...variation,
        //     couleur_image: data
        //   }));
        this.VariationsArray = this.VariationsArray.map(variation => ({
            ...variation,
            couleur_image: data,
            vals: variation.vals.map((val:any) => ({
                ...val,
                couleur_image: data
            }))
        }));

          console.log(this.VariationsArray);

    }
}
