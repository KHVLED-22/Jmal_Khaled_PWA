export class Machine {
    id?: number;
    port?: string | null;
    adresseIP?: string | null;
    marque?: string | null;
    modele?: string | null;
    description?: string | null;
    statut?: string | null;
    createdAt?: string;
    updatedAt?: string;
    name?: string;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.port = attributes?.port;
        this.adresseIP = attributes?.adresseIP;
        this.marque = attributes?.marque;
        this.modele = attributes?.modele;
        this.description = attributes?.description;
        this.statut = attributes?.statut;
        this.createdAt = attributes?.createdAt;
        this.updatedAt = attributes?.updatedAt;
        this.name = attributes?.name;
    }

    static mapMachines(data: any[]): Machine[] {
        return data.map((item) => new Machine(item.id, item.attributes));
    }
}