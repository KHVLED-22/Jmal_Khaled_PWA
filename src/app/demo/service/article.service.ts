import { article } from './../api/article';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environnement/environnement';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

    constructor(private http: HttpClient) { }


    private mapToArticle(item: any): article {

        return {
            id: item.id,
            nom_article: item.attributes.nom_article ?? "",
            reference: item.attributes.reference ?? "",
            description: item.attributes.description ?? "",
            image: {
                id: item.attributes?.image?.data?.id ?? "",
                name: item.attributes?.image?.data?.attributes?.formats?.thumbnail?.url
                    ? "http://192.168.0.245" + item.attributes?.image.data?.attributes?.formats?.thumbnail?.url
                    : ""
            },
            images: item.attributes?.images?.data?.map((image:any)=>({
                id:image?.id,
                name:image?.attributes?.formats?.thumbnail?.url
                ? "http://192.168.0.245" + item.attributes?.image.data?.attributes?.formats?.thumbnail?.url
                : ""

            })) ?? [],
            prix_achat: item.attributes.prix_achat ?? 0,
            prix_vente: item.attributes.prix_vente ?? 0,
            marque: {
                id: item.attributes.marque?.data?.id ?? "",
                nom: item.attributes.marque?.data?.attributes?.nom ?? ""
            },
            categories: item.attributes.categories?.data?.map((item: any) => ({
                id: item?.id ?? "",
                nom: item?.attributes?.nom ?? ""
            })) ?? [],
            attribut: item.attributes.attribut?.data?.attributes ?? {}, // Set default as empty object
            balise_titre: item.attributes.balise_titre ?? "",
            meta_desc: item.attributes.meta_desc ?? "",
            meta_motsCle: item.attributes.meta_motsCle ?? "",
            url_simp: item.attributes.url_simp ?? "",
            couleurs: item.attributes.couleurs?.data?.map((couleur: any) => ({
                id: couleur?.id ?? "",
                valeur: couleur?.attributes?.valeur ?? "",
                code_hexa: couleur?.attributes?.code_hexa ?? "",
                designation: couleur?.attributes?.code_hexa ?? "",
                couleur_images: couleur?.attributes?.couleur_images ?? []
            })) ?? [],
            variations: item.attributes?.variations.data?.map((variation: any) => ({
                id: variation.id ?? "",
                code_a_barre: variation.attributes?.code_a_barre ?? "",
                activer: variation.attributes?.activer ?? false,
                prix_achat: variation.attributes?.prix_achat ?? 0,
                prix_vente: variation.attributes?.prix_vente ?? 0,
                stock: variation.attributes?.stock ?? 0,
                attribut_value: variation.attributes?.attribut_value?.data?.attributes ?? ""
            })) ?? [],
            activer: item.attributes?.activer ?? false,
            dimensionner: item.attributes?.dimensionner ?? false,
            publier: item.attributes?.publier ?? false,
            qte_Total: item.attributes?.qte_Total ?? 0,
            articleAssicie: item.attributes?.associerHas.data.map((article:any)=>({id:article.id})) ?? []
        };

  }

    getArticles(data?:string,pageSize?: any,currentPage?: any,sortFiled?:any,sortMode?:any,filter?:any) {
        let url = `${environment.url}/articles?populate=marque&populate=categories&populate=variations&populate=variations.attribut_value&populate=images&populate=image&populate=associerHas&populate=couleurs&populate=couleurs.couleur_images&populate=attribut`;
        let params = new HttpParams();

        if (pageSize && currentPage) {
            params = params
              .set('pagination[pageSize]', pageSize)
              .set('pagination[page]', currentPage);
          }
          if (sortMode=== 1 && sortFiled) {
            url += `&sort=${sortFiled}:DESC`;
          } else if (sortMode=== -1 && sortFiled) {
            url += `&sort=${sortFiled}:ASC`;
          }

        if(data){
            const dataType = typeof data
            console.log(dataType)
                      if (typeof data === 'string') {

            url += `&filters[$or][0][nom_article][$containsi]=${data}`;
            url += `&filters[$or][1][reference][$containsi]=${data}`;
            url += `&filters[$or][2][activer][$eq]=${data}`;
            // url += `&filters[$or][1][categories][$containsi]=${data}`;
            url += `&filters[$or][3][marque][nom][$containsi]=${data}`;

            const numericData = parseFloat(data);
            if(!isNaN(numericData)){
                url += `&filters[$or][7][id][$eq]=${numericData}`;
                url += `&filters[$or][4][prix_achat][$eq]=${numericData}`;
                url += `&filters[$or][5][prix_vente][$eq]=${numericData}`;
                url += `&filters[$or][6][qte_Total][$eq]=${numericData}`;
            }

        }
    }

        if(filter){
            let index = 0;

            Object.entries(filter).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (['qte_Total', 'prix_vente', 'prix_achat'].includes(key)) {
                        value = parseFloat(String(value));
                        url += `&filters[$or][${index}][${key}][$eq]=${value}`;
                        index++;

                    }
                    else
                    if (Array.isArray(value)) {
                        value.forEach((element) => {


                            if (['reference', 'nom_article',].includes(key)) {
                                url += `&filters[$or][${index}][${key}][$containsi]=${element[key]}`;

                            }
                            if (['categories','marque'].includes(key)){
                                url += `&filters[$or][${index}][${key}][nom][$containsi]=${element.nom}`;

                            }
                            if (['activer'].includes(key)){
                                url += `&filters[$or][${index}][${key}][$containsi]=${element}`;

                            }
                            index++;

                        });
                    } else {
                        url += `&filters[$or][${index}][${key}][$containsi]=${value}`;
                        index++;

                    }
                }       });
        }

        return this.http
            .get<any>(url,{params})
            .toPromise()
            .then((res) =>
        {
            console.log(res)
            return {
                articles:res.data.map((item: any) => this.mapToArticle(item)),
                pagination: {
                    total: res.meta.pagination.total,
                    perPage: res.meta.pagination.pageSize,
                    currentPage: res.meta.pagination.pageCount,
                  }
             };
        })
            .then((data) => data)
            .catch((error) => {
                console.error('Error fetching Articles :', error);
                throw error;
              });
    }




  postArticle(Article:any){
    let url = `${environment.url}/createArticle`;
    let body={data:Article}
    return this.http
    .post<any>(url, body)
    .toPromise()
    .then((res) => {
        return {
            activer: res?.activer,
            articleAssicie: res?.associerHas?.map((associe: any) => associe?.id) || [],
            attribut: res.attribut?.id,
            balise_titre: res?.balise_titre,
            categories: res?.categories || [],
            couleur_images: res?.couleur_images || [],
            description: res.description,
            dimensionner: res?.dimensionner,
            id: res.id,
            image: {
                id: res?.image?.id,
                name: res?.image?.formats?.thumbnail?.url ?
                    "http://192.168.0.245" + res?.image.formats?.thumbnail?.url :
                    ""
            },
            images: res?.images?.map((image: any) => ({
                id: res?.image?.id,
                name: res?.image?.formats?.thumbnail?.url ?
                    "http://192.168.0.245" + res?.image?.formats?.thumbnail?.url :
                    ""
            })) || [],
            marque: res?.marque,
            meta_desc: res?.meta_desc,
            meta_motsCle: res?.meta_motsCle,
            nom_article: res.nom_article,
            prix_achat: res.prix_achat,
            prix_vente: res.prix_vente,
            publier: res?.publier,
            qte_Total: res?.qte_Total,
            reference: res.reference,
            url_simp: res?.url_simp,
            variations: res?.variations?.map((v: any) => ({
                id: v?.id,
                code_a_barre: v?.code_a_barre,
                activer: v?.activer,
                attribut_value: v?.attribut_value,
                couleur_image: v?.couleur_image,
                prix_achat: v?.prix_achat,
                prix_vente: v?.prix_vente,
                stock: v?.stock,
            })) || []
        };
    })
    .then((data) => data)
    .catch((error) => {
        console.error('Error creating Article:', error);
        throw error;
    });

  }

  updateImagePrincipalArticle(image:any,id:number){
    let url = `${environment.url}/articles/${id}`;
    let body={data:image}
    return this.http
        .put<any>(url,body)
        .toPromise()
        .then((res) =>{
          return res})
          .then((data) => data)
          .catch((error) => {
            console.error('Error updating image principale article:', error);
            throw error;
          });

  }

  updateArticle(Article:any,id:number){
    let url = `${environment.url}/updateArticle/${id}`;
    let body={data:Article}
    return this.http
        .put<any>(url,body)
        .toPromise()
        .then((res) =>{
            return res
         })
          .then((data) => data)
          .catch((error) => {
            console.error('Error updating Article:', error);
            throw error;
          });
  }


  getArticleById(id:number){
    let url = `${environment.url}/articles/${id}?populate=marque&populate=categories&populate=variations&populate=variations.attribut_value&populate=images&populate=image&populate=associerHas&populate=couleurs&populate=couleurs.couleur_images&populate=attribut`;

    return this.http
        .get<any>(url)
        .toPromise()
        .then((res) =>
    {
        console.log(res)
        // return this.mapToArticle(res)
        return res 


    })
        .then((data) => data)
        .catch((error) => {
            console.error('Error fetching Articles :', error);
            throw error;
          });
  }

}
