import { Equipe } from "./equipe";
import { Departement } from "./departement";
import { Establishment } from "./etablissement";
import { poste } from "./poste";
import { Planning} from "./planing";
import { UserData } from "./equipe";
import { contract } from "./contract";
import { Societe } from "./societe";
import { Machine } from "./machine";

export class Employee {
    id?: number;
    tel?: number;
    date_embauche?: Date;
    nom?: string;
    prenom?: string;
    sexe?: string;
    etat_civil?: string;
    nombre_enfant?: number;
    matricule_cnss?: string;
    societe?: Societe;
    equipe?: Equipe;
    regime_horaire?: Planning;
    poste?: poste;
    departement?: Departement;
    sup_hierarchique?: UserData;
    type_contrat?: contract;
    user? : UserData ;
    etablissement? : Establishment ;
    date_naissance ? :Date ;
    tel_professionnel? : number;
    document? : number ;
    user_machines? : number ;
    photo? : string ;

    constructor(id? :any ,attributes?: any ) {
        this.id = id;
        this.tel = attributes?.tel;
        this.photo =attributes?.document?.data?.attributes?.photo?.data ? attributes?.document?.data?.attributes?.photo?.data[0]?.attributes?.url : undefined
        this.tel_professionnel = attributes?.tel_professionnel;
        this.date_embauche = new Date(attributes?.date_embauche);
        this.date_naissance = new Date(attributes?.date_naissance);
        this.nom = attributes?.nom;
        this.prenom = attributes?.prenom;
        this.sexe = attributes?.sexe;
        this.etat_civil = attributes?.etat_civil;
        this.nombre_enfant = attributes?.nombre_enfant;
        this.matricule_cnss = attributes?.matricule_cnss;
        this.document = attributes?.document?.data?.id;
        this.user_machines = attributes?.user?.data?.attributes?.user_machines?.data[0]?.id;
        this.societe = attributes?.societe?.data ? new Societe(attributes.societe.data.id , attributes.societe.data.attributes) : undefined;
        this.equipe = attributes?.equipe?.data ? new Equipe(attributes.equipe.data.id , attributes.equipe.data.attributes) : undefined;
        this.regime_horaire = attributes?.regime_horaire?.data ? new Planning(attributes.regime_horaire.data.id , attributes.regime_horaire.data.attributes) : undefined;
        this.poste = attributes?.poste?.data ? new poste(attributes.poste.data.id , attributes.poste.data.attributes) : undefined;
        this.departement = attributes?.departement?.data ? new Departement(attributes.departement.data.id ,attributes.departement.data.attributes) : undefined;
        this.sup_hierarchique = attributes?.sup_hierarchique?.data ? new UserData(attributes.sup_hierarchique.data.id, attributes.sup_hierarchique.data.attributes) : undefined;
        // this.regime_conge = attributes.regime_conge?.data; 
        this.user = attributes?.user?.data ? new UserData(attributes?.user?.data?.id , attributes?.user?.data?.attributes) : undefined;
        this.type_contrat = attributes?.type_contrat?.data ? new contract(attributes.type_contrat.data.id , attributes.type_contrat.data.attributes) : undefined;
        // this.machine = attributes?.user?.data ? new Machine(attributes?.user?.data?.id , attributes?.user?.data?.attributes) : undefined;
        this.etablissement = attributes?.user?.data?.attributes?.etablissement?.data ? new Establishment(attributes?.user?.data?.attributes?.etablissement?.data?.id , attributes?.user?.data?.attributes?.etablissement?.data?.attributes) : undefined;
    }

    static mapEmployees(data: any[]): Employee[] {
        return data.map((item) => new Employee(item.id , item.attributes));
    }
 


    toPost?() {
        const offset = (new Date()).getTimezoneOffset() * 60000;
        const adjustedDateEmbauche = this.date_embauche ? new Date(this.date_embauche.getTime() - offset).toISOString().split('T')[0] : undefined;
        const adjustedDateNaissance = this.date_naissance ? new Date(this.date_naissance.getTime() - offset).toISOString().split('T')[0] : undefined;
    
        const postData: any = {
            tel: this.tel,
            date_embauche: adjustedDateEmbauche,
            nom: this.nom,
            prenom: this.prenom,
            sexe: this.sexe,
            etat_civil: this.etat_civil,
            nombre_enfant: this.nombre_enfant,
            matricule_cnss: this.matricule_cnss,
            societe: this.societe?.id,
            equipe: this.equipe?.id,
            regime_horaire: this.regime_horaire?.id,
            poste: this.poste?.id,
            departement: this.departement?.id,
            sup_hierarchique: this.sup_hierarchique?.id,
            user: this.user,
            type_contrat: this.type_contrat?.id,
            etablissement: this.etablissement?.id,
            date_naissance: adjustedDateNaissance,
            tel_professionnel: this.tel_professionnel
        };
    
        if (this.id) {
            postData.id = this.id;
        }
    
        return postData;
    }
    
}
export class userMachine {
    id?:number ;
    userID? : string ;
    machine? : Machine ;
    constructor(id? :any ,attributes?: any) {
        this.id = id;
        this.userID = attributes?.userId ? attributes?.userId : id ;
        this.machine = attributes?.machine?.data ? new Machine(attributes?.machine?.data?.id ,attributes?.machine?.data?.attributes ) : undefined
    }

}
