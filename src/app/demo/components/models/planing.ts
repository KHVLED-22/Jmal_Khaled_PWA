import { UserData } from "./equipe";
import { User } from "./user";

export class Planning {
    id?: number;
    nom?: string | null;
    createdAt?: string;
    updatedAt?: string;
    description? : string | null ;
    planning_horaire?: string | null;
    debut_validite?: Date | null;
    fin_validite?: Date | null;
    users? : UserData[] | []
    nombre_heures? : number | null 
    groupe_regime_horaire?: GroupeRegimeHoraire [] | null;
    jour_regime_horaires?: JourRegimeHoraire[] | null;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.nom = attributes.nom;
        this.description = attributes?.description;
        this.createdAt = attributes.createdAt;
        this.updatedAt = attributes.updatedAt;
        this.planning_horaire = attributes.planning_horaire;
        this.nombre_heures = attributes.nb_heures;
        this.debut_validite = new Date(attributes.debut_validite);
        this.fin_validite = new Date(attributes.fin_validite);
        this.users = attributes.users?.data ? UserData.mapUsers(attributes.users?.data) : [] ;
        this.groupe_regime_horaire = attributes?.groupe_regime_horaires?.data ? GroupeRegimeHoraire.mapGroups(attributes?.groupe_regime_horaires?.data) : [] ;
        this.jour_regime_horaires = attributes?.jour_regime_horaires ? JourRegimeHoraire.mapJourRegimeHoraires(attributes?.jour_regime_horaires?.data) : null;
    }

    static mapPlannings(data: any[]): Planning[] {
        return data.map((item) => new Planning(item.id, item.attributes));
    }
}

export class GroupeRegimeHoraire {
    id?: number;
    nom?: string | null;
    description? : string | null ;
    planings? : Planning [] | null ;
    createdAt?: string;
    updatedAt?: string;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.nom = attributes?.nom;
        this.description = attributes?.description;
        this.createdAt = attributes?.createdAt;
        this.updatedAt = attributes?.updatedAt;
        this.planings = attributes?.regime_horaires?.data ?  Planning.mapPlannings(attributes?.regime_horaires?.data) : []
    }
    static mapGroups(data: any[]): GroupeRegimeHoraire[] {
        return data.map((item) => new GroupeRegimeHoraire(item.id, item.attributes));
    }
}

export class JourRegimeHoraire {
    id?: number;
    nom?: string | null;
    createdAt?: string;
    updatedAt?: string;
    travail?: boolean | null;
    heureEntree1?: Date | null;
    heureSortie1?: Date | null;
    heureEntree2?: Date | null;
    heureSortie2?: Date | null;
    heureDepartPause?: Date | null;
    heureFinPause?: Date | null;
    nbre_heures_prevues?: number | null;
    duree_pause?: number | null;
    nbrePointages?: number | null;
    sortieDemandee?: boolean | null;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.nom = attributes?.nom;
        this.createdAt = attributes?.createdAt;
        this.updatedAt = attributes?.updatedAt;
        this.travail = attributes?.travail;
        this.heureEntree1 = this.parseTime(attributes?.heureEntree1);
        this.heureSortie1 = this.parseTime(attributes?.heureSortie1);
        this.heureEntree2 = this.parseTime(attributes?.heureEntree2);
        this.heureSortie2 = this.parseTime(attributes?.heureSortie2);
        this.heureDepartPause = this.parseTime(attributes?.heureDepartPause);
        this.heureFinPause = this.parseTime(attributes?.heureFinPause);
        this.nbre_heures_prevues = attributes?.nbre_heures_prevues;
        this.duree_pause = attributes?.duree_pause;
        this.nbrePointages = attributes?.nbrePointages;
        this.sortieDemandee = attributes?.sortieDemandee;
    }

    static mapJourRegimeHoraires(data: any[]): JourRegimeHoraire[] {
        return data.map((item) => new JourRegimeHoraire(item.id, item.attributes));
    }

    private parseTime(timeString: string | null): Date | null {
        if (!timeString) {
            return null;
        }
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds, 0);
        return date;
    }

    private formatTime(date: Date | null): string | null {
        if (!date) {
            return null;
        }
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    toPlainObject() {
        return {
            id: this.id,
            nom: this.nom,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            travail: this.travail,
            heureEntree1: this.formatTime(this.heureEntree1!),
            heureSortie1: this.formatTime(this.heureSortie1!),
            heureEntree2: this.formatTime(this.heureEntree2!),
            heureSortie2: this.formatTime(this.heureSortie2!),
            heureDepartPause: this.nbrePointages === 4 ? this.formatTime(this.heureSortie1!) : this.formatTime(this.heureDepartPause!),
            heureFinPause: this.nbrePointages === 4 ? this.formatTime(this.heureEntree2!) : this.formatTime(this.heureFinPause!),
            nbre_heures_prevues: this.nbre_heures_prevues,
            duree_pause: this.duree_pause,
            nbrePointages: this.nbrePointages,
            sortieDemandee: this.sortieDemandee,
        };
    }
}

