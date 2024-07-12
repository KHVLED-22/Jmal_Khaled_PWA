import { Departement } from "./departement";

export class poste {
    id?: number;
    titre?: string;
    departements? : Departement []  
    description? : string 

    constructor(id: number, attributes: any ) {
        this.id = id;
        this.titre = attributes?.titre 
        this.description = attributes?.description
        this.departements = attributes?.departements?.data ? Departement.mapDepartements(attributes?.departements?.data) : [] ;
    }

    static mapPoste(data: any[]): poste[] {
        return data.map((item) => new poste(item.id, item.attributes ));
    }
}