import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { KanbanCard } from 'src/app/demo/api/kanban';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/demo/service/image.service';
@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrl: './card-image.component.scss'
})
export class CardImageComponent implements OnInit{
    @Input() card!: KanbanCard;
    @Input() FieldImage!: string;

    @Input() listId!: string;
    @Input() listSended!: any;


    menuItems: MenuItem[] = [];
    image_prin:any
    img_prin_variation:any
    col_images:any[]=[];
    subscription: Subscription;

    constructor(private ImageService: ImageService) {
        this.subscription = this.ImageService.lists$.subscribe((data) => {
            let subMenu = data.map((d) => ({ id: d.listId, label: d.title, command: () => this.onMove(d.listId) }));
            this.generateMenu(subMenu);
        });
    }


    ngOnInit(){
    console.log('receivedcard',this.card,);
    console.log('list',this.listId,this.listSended)
    console.log('field',this.FieldImage)



    // if(this.ImageService.getImagePrinVariation() !== null){
    //     console.log(this.ImageService.getImagePrinVariation());
    // this.img_prin_variation=this.ImageService.getImagePrinVariation()

    //    }
    this.image_prin = this.ImageService.getImagePrin();
    this.col_images = this.ImageService.getColImages();

    // console.log('Image Principal:', this.image_prin);
    // console.log('Couleur Image:', this.col_images);

    // if (this.listSended.listId === "2") {
    //     this.image_prin = this.listSended.cards.length > 0 ? this.listSended.cards[0].id  : null;
    //     this.col_images = Array.from(new Set(this.listSended.cards.map((card: any) => card.id)));
    // } else {
    //     console.log('Image Principal:', this.image_prin);
    //     console.log('Couleur Image:', this.col_images);

    //     const cardIds = this.listSended.cards.map((card: any) =>
    //         card.id);
    //     console.log(cardIds);

    //     this.col_images = this.col_images.filter((id: any) => !cardIds.includes(id));


    //      // Check if image_prin exists in cardIds
    // if (this.image_prin && cardIds.includes(this.image_prin)) {
    //     // Reset image_prin to the first ID in col_images
    //     this.image_prin = this.col_images.length > 0 ? this.col_images[0]  : null;
    // }

    // }
    if (this.listSended.listId === "2" && this.FieldImage=='Variation') {
        this.col_images = Array.from(new Set(this.listSended.cards.map((card: any) => card.id)));
        this.img_prin_variation = this.listSended.cards.length > 0 ? this.listSended.cards[0].id  : null;

        console.log('Image Principal:', this.img_prin_variation);
        console.log(' Images variation:', this.col_images);

        this.ImageService.saveImagePrinVariation(this.img_prin_variation);
        this.ImageService.saveColImages(this.col_images);
        console.log(this.ImageService.lists$)
    // } else {
    //     console.log('Image Principal:', this.img_prin_variation);
    //     console.log('Couleur Image:', this.col_images);

    //     const cardIds = this.listSended.cards.map((card: any) =>
    //         card.id);
    //     console.log(cardIds);

    //     this.col_images = this.col_images.filter((id: any) => !cardIds.includes(id));


    //      // Check if img_prin_variation exists in cardIds
    // if (this.img_prin_variation && cardIds.includes(this.img_prin_variation)) {
    //     // Reset img_prin_variation to the first ID in col_images
    //     this.img_prin_variation = this.col_images.length > 0 ? this.col_images[0]  : null;
    // }

    }
    else if (this.listSended.listId === "1" && this.FieldImage === 'Variation') {
        // Get all the IDs from listSended.cards
        const cardIds = this.listSended.cards.map((card: any) => card.id);
        console.log('Card IDs:', cardIds);

        // Filter out card IDs from this.col_images
        this.col_images = this.col_images.filter((id: any) => !cardIds.includes(id));
        this.ImageService.saveColImages(this.col_images);

        console.log('cardID',cardIds,'imageprincipalvariation',this.img_prin_variation)
        console.log(cardIds.includes(this.img_prin_variation))

        if (cardIds.includes(this.img_prin_variation)) {
            // If img_prin_variation is in col_images, update img_prin_variation to take the first ID from col_images
            this.img_prin_variation = this.col_images[0];
            this.ImageService.saveImagePrinVariation(this.img_prin_variation);

            console.log('Updated Image Principal variation:', this.img_prin_variation);
        }


            console.log('Updated  Images variation:', this.col_images);
    }

    else
    if(this.listSended.listId === "2" && this.FieldImage=='Article'){
        this.image_prin = this.listSended.cards.length > 0 ? this.listSended.cards[0].id  : null;


    console.log('Image Principal:', this.image_prin);
    console.log('Couleur Image:', this.col_images);

    this.ImageService.saveImagePrin(this.image_prin);
    this.ImageService.saveColImages(this.col_images);
    console.log(this.ImageService.lists$)

    }



    }

    parseDate(dueDate: string) {
        return new Date(dueDate).toDateString().split(' ').slice(1, 3).join(' ');
    }

    onDelete() {
        this.ImageService.deleteCard(this.card.id, this.listId);
    }

    onCopy() {
        this.ImageService.copyCard(this.card, this.listId);
    }

    onMove(listId: string) {
        this.ImageService.moveCard(this.card, listId, this.listId);
    }

    generateMenu(subMenu: any[]) {
        this.menuItems = [
            { label: 'Copy card', command: () => this.onCopy() },
            { label: 'Move card', items: subMenu },
            { label: 'Delete card', command: () => this.onDelete() }
        ];
    }

    generateTaskInfo() {
        // let total = this.card.taskList.tasks.length;
        // let completed = this.card.taskList.tasks.filter((t) => t.completed).length;
        // return `${completed} / ${total}`;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
