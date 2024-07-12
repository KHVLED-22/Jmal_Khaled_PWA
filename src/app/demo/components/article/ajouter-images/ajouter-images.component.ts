import { Component, ElementRef, EventEmitter, Input,  OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { KanbanCard, KanbanList } from 'src/app/demo/api/kanban';
import { MenuItem, MessageService } from 'primeng/api';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/demo/service/image.service';
import { VariationService } from 'src/app/demo/service/variation.service';
import { ArticleService } from 'src/app/demo/service/article.service';

@Component({
  selector: 'app-ajouter-images',
  templateUrl: './ajouter-images.component.html',
  styleUrl: './ajouter-images.component.scss',
  providers: [ImageService]

})
export class AjouterImagesComponent implements OnDestroy{
    @Output() sendImageToParent: EventEmitter<any> = new EventEmitter<any>();

    @Input() data: any;
    @Input() changedList: any;

    ImageDialog:boolean = false;
    //********************************
    sidebarVisible: boolean = false;

    lists: KanbanList[] = [];

    listIds: string[] = [];

    // subscription = new Subscription();
    Field:string="";
    couleur_image:any
    style!: HTMLStyleElement;

    isMobileDevice: boolean = false;
    private subscription: Subscription ;


    //********************************

    constructor( private ImageService: ImageService,private variationService:VariationService,private messageService:MessageService,private ArticleService:ArticleService) {
        this.subscription = this.ImageService.lists$.subscribe((data) => {
            console.log(data)
            this.lists = data;


            this.listIds = this.lists.map((l) => l.listId || '');
        });
    }

    ngOnDestroy(): void {
        console.log('ngOnDestroy test');
        if (this.subscription) {

        this.subscription.unsubscribe();
        // document.head.removeChild(this.style);
        }

    }
   async   ngOnChanges(changes: SimpleChanges)  {


        if (changes && this.changedList) {

            // Perform any action needed when data changes
            console.log('Data changed:', this.data);
        //  this.subscription = this.ImageService.lists$.subscribe((data) => {
        //     console.log(data)

            this.lists = this.changedList;
            // console.log(typeof (this.lists[0].listId))

            this.listIds = this.lists.map((l) => l.listId || '');

            console.log(this.lists)
            console.log( this.listIds)


        // });
    }
      await    this.removeLayoutResponsive();
      this.isMobileDevice = this.ImageService.isMobileDevice();
    }

    hideDialog(){
        this.ImageDialog=false
    }
  async  showDialog(data?:any,data1?:any,data3?:any){
        console.log(this.lists)
         let list=[...this.lists]
         console.log(list)

        // data1 peut etre imageprincipale article ou couleur image de la variation
        // data3 les images selecter pour un couleur_image
        this.ImageDialog=true
        if(data=='Variation'){
            this.Field=data
            this.couleur_image=data1
            console.log(data1)
            console.log('Variation',data1,'couleur images ',data3)
            if(data3.length>0 && data1.col_images.length>0){

                let allImages=this.ImageService.getAllImages()

            //    let  existingCards: any[] = [];
                        let newImages = data1.col_images.map((image:any) => ({
                            id: image.id.toString(),
                            imageUrl: image.name
                        }));

                        console.log(newImages)

                        let indexList1 = this.ImageService.staticList.data.findIndex((image: any) => image.listId === "2");
                        if (indexList1 !== -1) {

                        this.ImageService.staticList.data[indexList1].cards=newImages

                        await  this.ImageService.updateLists(this.ImageService.staticList.data);
                    console.log( this.ImageService.staticList.data)
                            }


                        let IndexList2 = this.ImageService.staticList.data.findIndex((image: any) => image.listId === "1");
                        console.log(IndexList2)

                        if(IndexList2!=-1){
                            console.log('testttt')
                            console.log(allImages)

                            let otherImg = allImages.filter((img: any) => !newImages.some((newimage: any) =>newimage.id==img.id));

                            if (!Array.isArray(otherImg)) {
                                otherImg = [otherImg];
                            }
                            console.log(otherImg)

                            this.ImageService.staticList.data[IndexList2].cards=otherImg
                            await  this.ImageService.updateLists(this.ImageService.staticList.data);
                            console.log( this.ImageService.staticList.data)
                        }


                        console.log( this.ImageService.staticList.data)


                        // console.log(this.lists)

                        // let imageToUpdateIndex = this.ImageService.staticList.data.findIndex((image: any) => image.listId === "2");
                        // if (imageToUpdateIndex !== -1) {


                        //      existingCards = this.ImageService.staticList.data[imageToUpdateIndex].cards.filter((card:any) => !newImages.some((newImage:any) => newImage.id === card.id));


                        //    // Remove existing cards from this.ImageService.staticList.data[imageToUpdateIndex].cards
                        // this.ImageService.staticList.data[imageToUpdateIndex].cards = this.ImageService.staticList.data[imageToUpdateIndex].cards.filter((card:any) => {
                        //     // Keep the card if its ID is not present in existingCards or if it's also present in newImages
                        //     return !existingCards.some((existingCard:any) => existingCard.id === card.id);
                        // });

                        //     console.log(  this.ImageService.staticList.data[imageToUpdateIndex].cards)

                        //     // Filter out newImages that already exist in this.ImageService.staticList.data[imageToUpdateIndex].cards
                        // const filteredNewImages = newImages.filter((newImage: any) => {
                        //     // Check if the newImage already exists in this.ImageService.staticList.data[imageToUpdateIndex].cards
                        //     return !this.ImageService.staticList.data[imageToUpdateIndex].cards.some((card: any) => card.id === newImage.id);
                        // });

                        // // Push only the filtered newImages to this.ImageService.staticList.data[imageToUpdateIndex].cards
                        // this.ImageService.staticList.data[imageToUpdateIndex].cards.push(...filteredNewImages);




                        // console.log(  this.ImageService.staticList)
                        // console.log( 'existingCards',existingCards)

                        // console.log(  this.lists)



                        // let IndexList =  this.lists.findIndex((image: any) => image.listId === "1");
                        // if (IndexList !== -1) {
                        //     console.log( this.lists[IndexList]); // Corrected line
                        //     console.log(IndexList); // Corrected line

                        //     console.log( this.lists); // Corrected line
                        //     console.log(newImages); // Corrected line



                        //     this.lists[IndexList].cards =  this.lists[IndexList].cards.filter((card: any) => {
                        //         // Check if the current card's ID is not present in newImages
                        //         return !newImages.some((newImage: any) => newImage.id === card.id);
                        //     });


                        // const filteredExistingCards = existingCards.filter((existingCard: any) => {
                        //     // Check if the existingCard already exists in this.lists[IndexList].cards
                        //     return !this.lists[IndexList].cards.some((card: any) => card.id === existingCard.id);
                        // });

                        // // Push only the filtered existingCards to this.lists[IndexList].cards
                        // this.lists[IndexList].cards.push(...filteredExistingCards);



                        //     console.log( this.lists[IndexList]); // Corrected line
                        //     console.log( this.lists); // Existing line


                        // }


                        // }



                    //   await  this.ImageService.updateLists(this.ImageService.staticList.data);

            }
            // variation sans couleurs images
            else{
                console.log(this.ImageService.getAllImages)
                let IndexList =  this.ImageService.staticList.data.findIndex((image: any) => image.listId === "1");
                if(IndexList!=-1){
                    this.ImageService.staticList.data[IndexList].cards=this.ImageService.getAllImages()
                    await  this.ImageService.updateLists(this.ImageService.staticList.data);
                    console.log(this.ImageService.staticList.data)


                }

                let IndexList2 =  this.ImageService.staticList.data.findIndex((image: any) => image.listId === "2");
                if(IndexList2!=-1){
                    this.ImageService.staticList.data[IndexList2].cards=[]
                    await  this.ImageService.updateLists(this.ImageService.staticList.data);
                    console.log(this.ImageService.staticList.data)

                }

                console.log(this.ImageService.staticList.data)


            }





        }
        if(data=='Article'){
            this.Field=data
            console.log('Article',this.Field,'image principale',data1)
            if(data1){
                let allImages=this.ImageService.getAllImages()
                console.log(allImages)
                let IndexList2 = this.ImageService.staticList.data.findIndex((image: any) => image.listId === "2");
                if(IndexList2!=-1){
                  let imagePrin=  allImages.find((img:any)=>img.id==data1)
                  if (imagePrin) {
                    // Convert a single object to an array
                    if (!Array.isArray(imagePrin)) {
                        imagePrin = [imagePrin];
                    }
                  }
                    console.log(imagePrin)

                    this.ImageService.staticList.data[IndexList2].cards=imagePrin
                    await  this.ImageService.updateLists(this.ImageService.staticList.data);
                    console.log( this.ImageService.staticList.data)
                }
                let IndexList1 = this.ImageService.staticList.data.findIndex((image: any) => image.listId === "1");
                console.log(IndexList1)
                if(IndexList1!=-1){
                    console.log('testttt')
                    console.log(allImages)

                    let otherImg = allImages.filter((img: any) => img.id !== data1);

                    if (!Array.isArray(otherImg)) {
                        otherImg = [otherImg];
                    }
                    console.log(otherImg)

                    this.ImageService.staticList.data[IndexList1].cards=otherImg
                    await  this.ImageService.updateLists(this.ImageService.staticList.data);
                    console.log( this.ImageService.staticList.data)
                }

            //     let targetCard:any=[];
            //     console.log('testt',this.lists)

            //     let targetImageId = this.ImageService.getImagePrin();
            //     console.log( targetImageId)

            //     targetCard = this.lists
            //      .flatMap(list => list.cards ? list.cards : [])
            //      .find(card => card.id === targetImageId);

            //      const result = targetCard ? [targetCard] : [];

            //     // Filter out cards with ID not equal to targetImageId
            // const otherCards = this.lists
            // .flatMap(list => list.cards ? list.cards : []) // Flatten the nested arrays of cards
            // .filter(card => card.id !== targetImageId); // Filter out cards with ID not equal to targetImageId

            // console.log('Other cards:', otherCards);

            //      console.log(targetCard)
            //      console.log(result)

            //     if (targetCard) {

            //         let imageToUpdateIndex = this.ImageService.staticList.data.findIndex((image: any) => image.listId === "2");
            //        if (imageToUpdateIndex !== -1) {

            //                 this.ImageService.staticList.data[imageToUpdateIndex].cards=result;

            //             console.log(  this.ImageService.staticList)
            //             console.log(  this.lists)

            //             }
            //                         }

            //     if (otherCards) {
            //         let List1 = this.ImageService.staticList.data.findIndex((image: any) => image.listId === "1");
            //         if (List1 !== -1) {

            //         this.ImageService.staticList.data[List1].cards=otherCards;

            //         console.log(  this.ImageService.staticList)
            //         console.log(  this.lists)

            //                                 }
            //     }


            //     this.ImageService.updateLists(this.ImageService.staticList.data);


        }
        else{
            console.log(this.ImageService.getAllImages())
            let IndexList =  this.ImageService.staticList.data.findIndex((image: any) => image.listId === "1");
            if(IndexList!=-1){
                this.ImageService.staticList.data[IndexList].cards=this.ImageService.getAllImages()
                await  this.ImageService.updateLists(this.ImageService.staticList.data);
            }


            let IndexList2 =  this.ImageService.staticList.data.findIndex((image: any) => image.listId === "2");
            if(IndexList2!=-1){
                this.ImageService.staticList.data[IndexList2].cards=[]
                await  this.ImageService.updateLists(this.ImageService.staticList.data);
            }

            console.log(this.ImageService.staticList.data)

        }
    }

    console.log(this.lists)
    console.log(this.ImageService.staticList.data)


    }
    //************************************************************************************************
    toggleSidebar() {
        this.sidebarVisible = true;
    }

    addList() {
        this.ImageService.addList();
    }

    dropList(event: CdkDragDrop<KanbanList[]>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    removeLayoutResponsive() {
        this.style = document.createElement('style');
        this.style.innerHTML = `
                .layout-content {
                    width: 100%;
                }

                .layout-topbar {
                    width: 100%;
                }
            `;
        document.head.appendChild(this.style);
    }


    //************************************************************************************************
    sauvegarderImages(){
        if(this.Field=='Article'){
            // this.ArticleService.updateImagePrincipalArticle()
            this.hideDialog()
        }else
        if(this.Field=='Variation'){
            let couleurImages={
                col_images:this.ImageService.getColImages(),
                image_prin:this.ImageService.getImagePrinVariation()
            }
      this.variationService.updateCouleurImages(couleurImages,this.couleur_image.id)
      .then(response =>
      {  console.log(response)

        let couleurimage={
            id:response.id,
            attribut_value:response.attribut_value,
            col_images:response.col_images.map((couleurimage:any)=>({
                id: couleurimage.id,
                name: couleurimage?.formats?.thumbnail?.url
                  ? "http://192.168.0.245" + couleurimage?.formats?.thumbnail?.url
                  : ""
            }))


        }
        this.sendImageToParent.emit(couleurimage)
        this.ImageDialog=false
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Images Attributé au couleur avec succé.' })}
      )
        }
    }

}

