import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { KanbanCard, KanbanList } from 'src/app/demo/api/kanban';
@Injectable({
  providedIn: 'root'
})
export class ImageService implements OnDestroy{



    private _lists: KanbanList[] = [];

    private selectedCard = new Subject<KanbanCard>();

    private selectedListId = new Subject<string>();

    private lists = new BehaviorSubject<KanbanList[]>(this._lists);

    private listNames = new Subject<any[]>();

    lists$ = this.lists.asObservable();

    selectedCard$ = this.selectedCard.asObservable();

    selectedListId$ = this.selectedListId.asObservable();

    listNames$ = this.listNames.asObservable();
    staticList:any={
    data: [
        {
            listId: "1",
            title: "Drag And Drop To the other list",
            cards: [

                ]
            },
            {
                listId: "2",
                title: "Drop Here",
                cards: [

                    ]
                }
            ]}
    private subscriptions: Subscription[] = [];

    constructor(private http: HttpClient) {
        // this.http
        //     .get<any>('assets/demo/data/kanban.json')
        //     .toPromise()
        //     .then((res) =>
        //     res.data as KanbanList[])
        //     .then((data) => {
        //         this.updateLists(data);
        //     });

                this.updateLists(this.staticList.data);


    }

    // **********************************************************************************






    // **********************************************************************************
    saveAllImages(imagePrin: any): void {
        localStorage.setItem('Images', JSON.stringify(imagePrin));
      }
    saveImagePrin(imagePrin: any): void {
        localStorage.setItem('imagePrin', JSON.stringify(imagePrin));
      }
      saveImagePrinVariation(imagePrin: any): void {
        localStorage.setItem('imagePrinVariation', JSON.stringify(imagePrin));
      }

      getAllImages(): any {
        const imagePrin = localStorage.getItem('Images');
        return imagePrin ? JSON.parse(imagePrin) : null;
      }
      getImagePrin(): any {
        const imagePrin = localStorage.getItem('imagePrin');
        return imagePrin ? JSON.parse(imagePrin) : null;
      }
      getImagePrinVariation(): any {
        const imagePrin = localStorage.getItem('imagePrinVariation');
        return imagePrin ? JSON.parse(imagePrin) : null;

      }


      saveColImages(colImages: any[]): void {
        localStorage.setItem('colImages', JSON.stringify(colImages));
      }

      getColImages(): any[] {
        const colImages = localStorage.getItem('colImages');
        return colImages ? JSON.parse(colImages) : [];
      }

    // **********************************************************************************

    ngOnDestroy() {
        // Unsubscribe from all subscriptions to prevent memory leaks
        this.subscriptions.forEach(sub => sub.unsubscribe());
      }

     updateLists(data: any[]) {
        this._lists = data;
        let small = data.map((l) => ({ listId: l.listId, title: l.title }));

        this.listNames.next(small);
        this.lists.next(data);
        console.log(this.lists)
        console.log(this.lists$ )
        this.subscriptions.push(this.lists$.subscribe(updatedData => {
            // console.log("Updated data received:", updatedData);
        }));

    }

    addList() {
        const listId = this.generateId();
        const title = 'Untitled List';
        const newList = {
            listId: listId,
            title: title,
            cards: []
        };

        this._lists.push(newList);
        this.lists.next(this._lists);
    }

    addCard(listId: string) {
        const cardId = this.generateId();
        const title = 'Untitled card';
        const newCard = { id: cardId, title: title, description: '', progress: '', assignees: [], attachments: 0, comments: [], startDate: '', dueDate: '', completed: false, taskList: { title: 'Untitled Task List', tasks: [] } };

        let lists = [];
        lists = this._lists.map((l) => (l.listId === listId ? { ...l, cards: [...(l.cards || []), newCard] } : l));
        this.updateLists(lists);
    }

    updateCard(card: KanbanCard, listId: string) {
        let lists = this._lists.map((l) => (l.listId === listId ? { ...l, cards: l.cards.map((c) => (c.id === card.id ? { ...card } : c)) } : l));
        this.updateLists(lists);
    }

    deleteList(id: string) {
        this._lists = this._lists.filter((l) => l.listId !== id);
        this.lists.next(this._lists);
    }

    copyList(list: KanbanList) {
        let newId = this.generateId();
        let newList = { ...list, listId: newId };

        this._lists.push(newList);
        this.lists.next(this._lists);
    }

    deleteCard(cardId: string, listId: string) {
        let lists = [];

        for (let i = 0; i < this._lists.length; i++) {
            let list = this._lists[i];

            if (list.listId === listId && list.cards) {
                list.cards = list.cards.filter((c) => c.id !== cardId);
            }

            lists.push(list);
        }

        this.updateLists(lists);
    }

    copyCard(card: KanbanCard, listId: string) {
        let lists = [];

        for (let i = 0; i < this._lists.length; i++) {
            let list = this._lists[i];

            if (list.listId === listId && list.cards) {
                let cardIndex = list.cards.indexOf(card);
                let newId = this.generateId();
                let newCard = { ...card, id: newId };
                list.cards.splice(cardIndex, 0, newCard);
            }

            lists.push(list);
        }

        this.updateLists(lists);
    }

    moveCard(card: KanbanCard, targetListId: string, sourceListId: string) {
        if (card.id) {
            this.deleteCard(card.id, sourceListId);
            let lists = this._lists.map((l) => (l.listId === targetListId ? { ...l, cards: [...(l.cards || []), card] } : l));
            this.updateLists(lists);
        }
    }

    onCardSelect(card: KanbanCard, listId: string) {
        this.selectedCard.next(card);
        this.selectedListId.next(listId);
    }

    generateId() {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    isMobileDevice() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || /(android)/i.test(navigator.userAgent);
    }
}
