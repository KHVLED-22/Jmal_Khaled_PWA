import { Equipe } from "./equipe";
import { Establishment } from "./etablissement";
import { User } from "./user";


export class Departement {
    id?: number;
    nom?: string | null;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string;
    chef_departement? : UserData ;
    equipes? : Equipe [] ;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.nom = attributes?.nom;
        this.description = attributes?.description;
        this.createdAt = attributes?.createdAt;
        this.updatedAt = attributes?.updatedAt;
        this.chef_departement = new UserData(attributes?.chef_departement?.data?.id,attributes?.chef_departement?.data?.attributes)
        this.equipes = attributes.equipes?.data ? Equipe.mapEquipes(attributes?.equipes?.data) : undefined
    }

    static mapDepartements(data: any[]): Departement[] {
        return data.map((item) => new Departement(item.id, item.attributes));
    }
}
export class UserData {
    id: number;
    username?: string;

    constructor(id: number, attributes: any , username? : string ) {
        this.id = id;
        this.username = attributes?.username != undefined ? attributes?.username : username;
    }

    static mapUsers(data: any[]): UserData[] {
        return data.map((item) => new UserData(item.id, item.attributes , item.username));
    }
}



