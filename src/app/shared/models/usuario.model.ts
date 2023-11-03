export class Usuario{
    id_Usuario:number;
    de_Usuario:string;
    de_Password:string;

    //VARIABLES APRA TOKEN
    access_Token:string | undefined;
    error_Description:string;
    expire_Date:string;
    expires_In:string;
}