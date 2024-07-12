export interface Attribut {
    id?: any;
    nom: string;
    designation?: string;
    attribut_values:ValAttribut[];
    visible: boolean;

}
export interface ValAttribut {
    id?: any;
    valeur: string;
    designation: string;
}
