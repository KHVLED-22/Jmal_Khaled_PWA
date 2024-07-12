import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Categorie } from 'src/app/demo/api/categorie';
import { environment } from 'src/environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
    // pageSize:any
    // currentPage:any
    private Categorie = new BehaviorSubject<any>({});
    data$ = this.Categorie.asObservable();
  constructor(private http: HttpClient) { }




  getCategorie(data?:string,pageSize?: any,currentPage?: any,sortFiled?:any,sortMode?:any){
    let url = `${environment.url}/categories?populate=image_categ&populate=categ_par`;
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
        url += `&filters[nom][$containsi]=${data}`;
      }
    return this.http
        .get<any>(url,{params})
        .toPromise()
        .then((res) => {
            return {
            categories: res.data.map((item: any) => {
            return {
              id: item.id,
              nom: item.attributes.nom,
              designation: item.attributes.designation,
              description: item.attributes?.description,
              image_categ:  {
                id: item.attributes?.image_categ?.data?.id,
                name: item.attributes?.image_categ?.data?.attributes?.formats?.thumbnail?.url
                  ? "http://192.168.0.245" + item.attributes?.image_categ.data?.attributes?.formats?.thumbnail?.url
                  : ""
              },
              baliseTitre: item.attributes?.balise_titre,
              metaDescription: item.attributes?.meta_desc,
              metaMotsCles: item.attributes?.meta_motsCle,
              urlSimplifiee: item.attributes?.url_simp,
              niveau: item.attributes?.niveau,
              path:item.attributes?.path,
              niveauParent: { id:item.attributes?.categ_par?.data?.id,nom: item.attributes?.categ_par?.data?.attributes?.nom},
              nbArticles: item.attributes?.nbArticle,
              activer: item.attributes?.visible,
              activerMenu: item.attributes?.visible_menu,

            } as Categorie;
          }),
          pagination: {
            total: res.meta.pagination.total,
            perPage: res.meta.pagination.pageSize,
            currentPage: res.meta.pagination.pageCount,
          }
        }
        })
          .catch((error) => {
            console.error('Error fetching categories:', error);
            throw error;
          });

}
    postCategorie(categ: Categorie) {
    let url = `${environment.url}/categories?populate=categ_par&populate=image_categ`;
    let body={data:categ}
    return this.http
        .post<any>(url,body)
        .toPromise()
        .then((res) =>{
            if (Array.isArray(res.data)) {
                console.log("categ from service",res.data)
                return res.data.map((item: any) => this.mapToCategorie(item));
              } else if (typeof res.data === 'object') {
                // console.log("categ from service",res.data)

                return this.mapToCategorie(res.data);
              }  else if (res.message) {
                // console.log("categ from service",res.data)

                return {'message': res.message};}
                else {
                throw new Error('Invalid response data format');
              }})
          .then((data) => data)
          .catch((error) => {
            console.error('Error creating categories:', error);
            throw error;
          });
}
updateCategorie(categ: Categorie,id:any) {
    let url = `${environment.url}/categories/${id}?populate=categ_par&populate=image_categ`;
    let body={data:categ}
    return this.http
        .put<any>(url,body)
        .toPromise()
        .then((res) =>{
            if (Array.isArray(res.data)) {
                console.log("categ from service",res.data)
                return res.data.map((item: any) => this.mapToCategorie(item));
              } else if (typeof res.data === 'object') {
                // console.log("categ from service",res.data)

                return this.mapToCategorie(res.data);
              } else {
                throw new Error('Invalid response data format');
              }})
          .then((data) => data)
          .catch((error) => {
            console.error('Error updating categories:', error);
            throw error;
          });
}
private mapToCategorie(item: any): Categorie {
    return {
      id: item.id,
      nom: item.attributes.nom,
      designation: item.attributes.designation,
      description: item.attributes?.description,
      baliseTitre: item.attributes?.balise_titre,
      metaDescription: item.attributes?.meta_desc,
      metaMotsCles: item.attributes?.meta_motsCle,
      urlSimplifiee: item.attributes?.url_simp,
      nbArticles: item.attributes?.nbArticle,
      path:item.attributes?.path,
      niveau: item.attributes?.niveau,
      niveauParent:{ id:item.attributes?.categ_par?.data?.id,nom: item.attributes?.categ_par?.data?.attributes?.nom},
      activer: item.attributes?.visible,
      activerMenu: item.attributes?.visible_menu,
      image:  {
        id: item.attributes?.image_categ?.data?.id,
        name: item.attributes?.image_categ?.data?.attributes?.formats?.thumbnail?.url
          ? "http://192.168.0.245" + item.attributes?.image_categ.data?.attributes?.formats?.thumbnail?.url
          : ""
      },
    };
  }

DeleteCategorie(id:any) {
    let url = `${environment.url}/categories/${id}`;
    return this.http
    .delete<any>(url)
    .toPromise()
    .then((res) => res.data as Categorie[])
    .then((data) => data)
    .catch((error) => {
            console.error('Error deleting categories:', error);
            throw error;
          });
}
sendcategorie(data:Categorie){
    this.Categorie.next(data);
}

getOrdredCategories(){
    let url = `${environment.url}/getCateg_CategPar?populate=image_categ&populate=categ_par`;
    let params = new HttpParams();

    return this.http
        .get<any>(url,{params})
        .toPromise()
        .then((res) => {
            return res.map((res:any) =>
           ( {parent1:res.categParent,
            children1:res.sousCategories.map((categ:any)=>
           ( {
                parent2:categ.sousCategorie,
            children2:categ.sousSousCategories.map((item:any)=>({
             parent3:item.sousSousCategorie,
             children3:item.SouSsousSousCategorie

            }))
        }))
        }
            ))
            // {
        //     categories: res.data.map((item: any) => {
        //     return {
        //       id: item.id,
        //       nom: item.attributes.nom,
        //       designation: item.attributes.designation,
        //       description: item.attributes?.description,
        //       image_categ:  {
        //         id: item.attributes?.image_categ?.data?.id,
        //         name: item.attributes?.image_categ?.data?.attributes?.formats?.thumbnail?.url
        //           ? "http://192.168.0.245" + item.attributes?.image_categ.data?.attributes?.formats?.thumbnail?.url
        //           : ""
        //       },
        //       baliseTitre: item.attributes?.balise_titre,
        //       metaDescription: item.attributes?.meta_desc,
        //       metaMotsCles: item.attributes?.meta_motsCle,
        //       urlSimplifiee: item.attributes?.url_simp,
        //       niveau: item.attributes?.niveau,
        //       path:item.attributes?.path,
        //       niveauParent: { id:item.attributes?.categ_par?.data?.id,nom: item.attributes?.categ_par?.data?.attributes?.nom},
        //       nbArticles: item.attributes?.nbArticle,
        //       activer: item.attributes?.visible,
        //       activerMenu: item.attributes?.visible_menu,

        //     } as Categorie;
        //   }),
        //   pagination: {
        //     total: res.meta.pagination.total,
        //     perPage: res.meta.pagination.pageSize,
        //     currentPage: res.meta.pagination.pageCount,
        //   }
        // }
        })
          .catch((error) => {
            console.error('Error fetching categories:', error);
            throw error;
          });

}

// getSearchedCateg(data?:string,pageSize?: any,currentPage?: any,sortFiled?:any,sortMode?:any) {
//     let url = `${environment.url}/categories?populate=image_categ&populate=categ_par`;
//     let params = new HttpParams();

//     if (pageSize && currentPage) {
//         params = params
//           .set('pagination[pageSize]', pageSize)
//           .set('pagination[page]', currentPage);
//       }
//       if (sortMode=== 1 && sortFiled) {
//         url += `&sort=${sortFiled}:DESC`;
//       } else if (sortMode=== -1 && sortFiled) {
//         url += `&sort=${sortFiled}:ASC`;
//       }
//       if(data){
//         url += `&filters[nom][$containsi]=${data}`;
//       }
//     return this.http
//         .get<any>(url,{params})
//         .toPromise()
//         .then((res) =>
//     {
//         return  {
//             categories:res.data.map((item: any) => this.mapToCategorie(item)),
//             pagination: {
//                 total: res.meta.pagination.total,
//                 perPage: res.meta.pagination.pageSize,
//                 currentPage: res.meta.pagination.pageCount,
//               }
//          };
//     })
//         .then((data) => data)
//         .catch((error) => {
//             console.error('Error fetching attribut :', error);
//             throw error;
//           });
// }

}
