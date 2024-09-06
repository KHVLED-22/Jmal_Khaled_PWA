import { Establishment } from "../models/etablissement";

export class pointage {
    id: number;
    date: string;
    nb_heures: number;
    etat: string;
    temps_sup: boolean;
    jour_de_conge: boolean;
    pointages: PointageItem[];
    user: UserData;
    nb_heures_supp?: number;
    nb_heures_manq?: number;
    totalPlanHoursWorked?: number;
    skipTime?: number;
    planning_horaire?: string;
    jour? : string ;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.date = attributes.date;
        this.jour = attributes.jour;
        this.nb_heures = attributes.nb_total ? attributes.nb_total : 0 ;
        this.temps_sup = attributes.temps_sup;
        this.jour_de_conge = attributes.jour_de_conge;
        this.pointages = attributes.pointages.data.map((item: any) => new PointageItem(item.id, item.attributes));
        this.user = new UserData(attributes.user.data.id, attributes.user.data.attributes);
        this.etat = attributes.pointages.data.length > 0 ? 'present' : 'absent';
        this.nb_heures_supp = attributes.nb_heures_supp ?attributes.nb_heures_supp  : 0;
        this.nb_heures_manq = attributes.nb_heures_manq?attributes.nb_heures_manq  : 0;
        this.totalPlanHoursWorked = attributes.totalPlanHoursWorked?attributes.totalPlanHoursWorked  : 0;
        this.skipTime = attributes.skipTime?attributes.skipTime  : 0;
        this.planning_horaire = attributes.user?.data?.attributes?.employe?.data?.attributes?.regime_horaire?.data?.attributes?.planning_horaire;
    }

    static mapPointage(data: any[]): pointage[] {
        return data.map((item) => new pointage(item.id, item.attributes));
    }
}

class PointageItem {
    id?: number;
    typePointage?: any;
    uid?: string;
    punch?: any;
    user_id?: any;
    status?: boolean;
    timestamp?: string;
    isDeleted?: boolean;
    virtuelle?: boolean;
    createdAt?: string;
    updatedAt?: string;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.typePointage = attributes?.typePointage;
        this.uid = attributes?.uid;
        this.punch = attributes?.punch;
        this.user_id = attributes?.user_id;
        this.status = attributes?.status;

        this.timestamp = this.convertToLocalTimezone(attributes?.timestamp);
        //console.log(this.timestamp)
        //console.log(attributes.timestamp)

        this.isDeleted = attributes?.isDeleted;
        this.virtuelle = attributes?.virtuelle;
        this.createdAt = attributes?.createdAt;
        this.updatedAt = attributes?.updatedAt;
        const timestampDate = new Date(this.timestamp);
        timestampDate.setHours(timestampDate.getHours() + 1);
        this.timestamp = timestampDate.toString();
    }

    private convertToLocalTimezone(apiTimestamp: string): string {
        const date = new Date(apiTimestamp);

        const offsetMinutes = date.getTimezoneOffset();

        const offsetMilliseconds = offsetMinutes * 60 * 1000;

        const localDate = new Date(date.getTime() + offsetMilliseconds);

        const isoString = localDate.toISOString();

        const parts = isoString.split('T');
        const datePart = parts[0];
        let timePart = parts[1].split('.')[0];

        const hourOffset = Math.abs(offsetMinutes) / 60;

        const hours = parseInt(timePart.split(':')[0]) + hourOffset;
        timePart = hours.toString().padStart(2, '0') + ':' + timePart.split(':')[1] + ':' + timePart.split(':')[2];

        return `${datePart}T${timePart}Z`;
    }
}

class UserData {
    id: number;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    etablissement?: Establishment;

    constructor(id: number, attributes: any) {
        this.id = id;
        this.provider = attributes.provider;
        this.confirmed = attributes.confirmed;
        this.blocked = attributes.blocked;
        this.username = attributes.username;
        this.email = attributes.email;
        this.createdAt = attributes.createdAt;
        this.updatedAt = attributes.updatedAt;
        this.etablissement = new Establishment(attributes.etablissement.data.id, attributes.etablissement.data.attributes)
    }
}
