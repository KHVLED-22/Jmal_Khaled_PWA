export class contract {
    id?: number;
    nom?: string;
    designation? : string 
    description? : string 

    constructor(id: number, attributes: any ) {
        this.id = id;
        this.nom = attributes?.nom 
        this.description = attributes.description
        this.designation = attributes.designation
    }

    static mapContract(data: any[]): contract[] {
        return data.map((item) => new contract(item.id, item.attributes ));
    }
}