import { Departement } from "./departement";
import { Establishment } from "./etablissement";
import { User } from "./user";

export class Equipe {
    id?: number;
    nom?: string | null;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string;
    chef_equipe?: UserData | null ;
    membres?: UserData[];
    departement?: Departement | null ;
    disabled?: boolean;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.nom = attributes.nom;
        this.description = attributes.description;
        this.createdAt = attributes.createdAt;
        this.updatedAt = attributes.updatedAt;
        this.chef_equipe = attributes.chef_equipe?.data ? new UserData(attributes.chef_equipe.data.id, attributes.chef_equipe.data.attributes) : null;
        this.membres = attributes.employes?.data ? UserData.mapUsers(attributes.employes.data , true) : [];
        this.departement = attributes.departement?.data ? new Departement(attributes.departement.data.id, attributes.departement.data.attributes) : null;
        this.disabled = attributes.appartient_departement; 
    }

    static mapEquipes(data: any[]): Equipe[] {
        return data.map((item) => new Equipe(item.id, item.attributes));
    }
}

export class UserData {
    id: number;
    email? : string ;
    username?: string;

    constructor(id: number, attributes: any , username? : string , is? : boolean ) {
        this.id = id;
        if(is){
            this.username = attributes?.nom +' '+ attributes?.prenom  
        }else{
            this.username = attributes?.username != undefined ? attributes?.username : username;
            this.email = attributes?.email
        }
    }

    static mapUsers(data: any[] , employee? : boolean): UserData[] {
        return data.map((item) => new UserData(item.id, item.attributes , item.username , employee));
    }
}
