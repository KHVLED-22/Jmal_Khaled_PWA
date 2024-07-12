import { Categorie } from "./categorie";
import { Marque } from "./marque";

export interface article {
    id?: number;
    nom_article: string;
    reference : string;
    description: string;
    image?: any;
    images?: any ;
    prix_achat: number ;
    remise?: number;
    prix_vente?: number;
    couleurs?: any;
    attribut?: any;
    marque?:any;
    categories?: any;
    variations?:any;
    activer?: boolean;
    publier?: boolean;
    qte_Total?: number;
    balise_titre?:string;
    meta_desc?:string;
    url_simp?:string;
    meta_motsCle?:string;
    dimensionner?:boolean;
    couleur_image?: any;
    articleAssicie:any;


}

export interface variation {
    id?: number;
    code_a_barre?: string;
    stock ?: number;
    couleur_image?: any;
    attribut_value?: any;
    article?: article;
    prix_achat: number;
    prix_vente?: number;
    remise?: number;
    activer?:boolean

}
