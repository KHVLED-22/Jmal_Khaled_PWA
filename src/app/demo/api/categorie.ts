export interface Categorie {
    id?: number;
    nom: string;
    designation : string;
    description?: string;
    image?: any;
    baliseTitre?: string;
    metaDescription?: string;
    metaMotsCles?: string;
    urlSimplifiee?:string;
    niveau?: any;
    niveauParent?: any;
    nbArticles?: number;
    activer?: boolean;
    activerMenu?: boolean;
    path?: string;
    children?:any[];

}
