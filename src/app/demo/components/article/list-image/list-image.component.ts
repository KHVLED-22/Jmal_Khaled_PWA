import { ImageService } from './../../../service/image.service';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { KanbanCard, KanbanList } from 'src/app/demo/api/kanban';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-list-image',
  templateUrl: './list-image.component.html',
  styleUrl: './list-image.component.scss',


})
export class ListImageComponent implements OnInit{
    @Input() list!: KanbanList;

    @Input() listIds!: string[];
    @Input() FieldImage!: string;

    menuItems: MenuItem[] = [];
    Field:string="";

    title: string = '';

    timeout: any = null;

    isMobileDevice: boolean = false;
    image_prin:any
    col_images:any[]=[];
    old_col_images:any[]=[];
    oldImage_prin:any
    @ViewChild('inputEl') inputEl!: ElementRef;

    @ViewChild('listEl') listEl!: ElementRef;

    constructor( private ImageService: ImageService,private messageService:MessageService
        ) {}

    ngOnInit(): void {

        console.log( 'received list',this.list)
        if(this.FieldImage== 'Article'){
            console.log( 'field is article');
            this.Field='Article';
        }else{
            console.log( 'field is variation');
            this.Field='Variation';

        }


        this.isMobileDevice = this.ImageService.isMobileDevice();

        this.menuItems = [
            {
                label: 'List actions',
                items: [
                    { separator: true },
                    { label: 'Copy list', command: () => this.onCopy(this.list) },
                    {
                        label: 'Remove list',
                        command: () => {
                            if (this.list.listId) {
                                this.onDelete(this.list.listId);
                            }
                        }
                    }
                ]
            }
        ];
    }

    toggleSidebar() {
        // this.parent.sidebarVisible = true;
    }

    onDelete(id: string) {
        this.ImageService.deleteList(id);
    }

    onCopy(list: KanbanList) {
        this.ImageService.copyList(list);
    }

    onCardClick(event: Event, card: KanbanCard) {
        const eventTarget = event.target as HTMLElement;
        if (!(eventTarget.classList.contains('p-button-icon') || eventTarget.classList.contains('p-trigger'))) {
            if (this.list.listId) {
                this.ImageService.onCardSelect(card, this.list.listId);
            }
            // this.parent.sidebarVisible = true;
        }
    }

    insertCard() {
        if (this.list.listId) {
            this.ImageService.addCard(this.list.listId);
        }
    }

    dropCard(event: CdkDragDrop<KanbanCard[]>): void {
        console.log(event);
       console.log(this.list);
       if(this.ImageService.getImagePrinVariation() !== null){
        console.log(this.ImageService.getImagePrinVariation());

       }
       console.log(this.list?.cards[0]?.id);
       console.log(this.FieldImage);
       console.log(typeof this.list.listId);
       console.log(event.container.data.length);

        if (event.previousContainer === event.container) {
            if(this.FieldImage == 'Variation' && this.list.listId=="2"  && event.container.data.length > 0){
                console.log('changed id of first image',this.list.cards[0].id,'current id of image',this.ImageService.getImagePrinVariation(),event.container.data)
                if(this.ImageService.getImagePrinVariation() && this.list.cards.length>0){
                    // this.ImageService.saveImagePrinVariation(event.container.data[0].id)
                    this.list.cards[0].id=this.ImageService.getImagePrinVariation()
                }
            }
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {

            if (this.FieldImage === 'Article' && this.list.listId=="2" && event.container.data.length > 0) {
                this.messageService.add({severity: 'info', summary: 'Info', detail: 'Choississez une seule Image.' });

                return;
            }


            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }

    }

    focus() {
        this.timeout = setTimeout(() => this.inputEl.nativeElement.focus(), 1);
    }

    insertHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '10rem';
    }

    removeHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '2rem';
    }
}
