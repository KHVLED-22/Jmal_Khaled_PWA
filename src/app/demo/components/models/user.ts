import { Establishment } from "./etablissement";

export class User {
    id?: number;
    provider?: string;
    confirmed?: boolean;
    blocked?: boolean;
    username?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
    etablissement? : Establishment ;

    constructor(id: number, provider: string, confirmed: boolean, blocked: boolean, 
                username: string, email: string, createdAt: string, updatedAt: string , etablissement : any) {
                    etablissement = {"data" :{ 
                    id : etablissement.id,
                    "attributes" : {
                        region : etablissement.region,
                        numTel : etablissement.numTel,
                        adresse : etablissement.adresse,
                        mail : etablissement.mail,
                        description : etablissement.description,
                        createdAt : etablissement.createdAt,
                        updatedAt : etablissement.updatedAt,
                        name : etablissement.name
                    },}}
        this.id = id;
        this.provider = provider;
        this.confirmed = confirmed;
        this.blocked = blocked;
        this.username = username;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.etablissement = new Establishment(etablissement.data.id ,etablissement.data.attributes) ;
    }

    static mapUsers(data: any[]): User[] {
        return data?.map((userData) => {
            return new User(
                userData.id,
                userData.provider,
                userData.confirmed,
                userData.blocked,
                userData.username,
                userData.email,
                userData.createdAt,
                userData.updatedAt,
                userData.etablissement
            );
        });
    }
}