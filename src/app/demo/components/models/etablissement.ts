export class Establishment {
    id?: number;
    region?: string | null;
    numTel?: string | null;
    adresse?: string | null;
    mail?: string | null;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string;
    name?: string;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.region = attributes?.region;
        this.numTel = attributes.numTel;
        this.adresse = attributes.adresse;
        this.mail = attributes.mail;
        this.description = attributes.description;
        this.createdAt = attributes.createdAt;
        this.updatedAt = attributes.updatedAt;
        this.name = attributes.name;
    }

    static mapEstablishments(data: any[]): Establishment[] {
        return data.map((item) => new Establishment(item.id, item.attributes));
    }
}

