export interface AttributCouleur {
    id?: any;
    nom: string;
    designation?: string;
    attribut_values:ValCouleur[];
    visible: boolean;

}
export interface ValCouleur {
    id?: any;
    valeur: string;
    designation: string;
    code_hexa: string;
    attribut:any
}
