export class Societe {
    id?: number;
    nom?: string | null;
    matriculeFiscale?: string | null;
    adresse?: string | null;
    tel?: string | null;
    fax?: string | null;
    // email?: string | null;
    createdAt?: string;
    updatedAt?: string;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.nom = attributes.nom;
        this.matriculeFiscale = attributes.matriculeFiscale;
        this.adresse = attributes.adresse;
        this.tel = attributes.tel;
        this.fax = attributes.fax;
        // this.email = attributes.email;
        this.createdAt = attributes.createdAt;
        this.updatedAt = attributes.updatedAt;
    }

    static mapSocietes(data: any[]): Societe[] {
        return data.map((item) => new Societe(item.id, item.attributes));
    }
}
