import axios, { AxiosError } from "axios";
import { getTokens, saveTokens, clearTokens } from "../storage/keychain";

const API = axios.create({

baseURL: "https://dummyjson.com"

});


API.interceptors.request.use(

 async config => {

   const tokens = await getTokens();

   if (tokens?.accessToken) {

     config.headers.Authorization =
       `Bearer ${tokens.accessToken}`;

   }

   return config;

 }

);



API.interceptors.response.use(

 res => res,

 async (error: AxiosError) => {

   const originalRequest: any = error.config;

   if (

     error.response?.status === 401 &&
     !originalRequest._retry

   ) {

     originalRequest._retry = true;

     try {

       const tokens = await getTokens();

       const res = await axios.post(

         "https://dummyjson.com/auth/refresh",

         {

           refreshToken:
             tokens?.refreshToken,

           expiresInMins: 30,

         }

       );


       await saveTokens(

         res.data.accessToken,
         res.data.refreshToken

       );


       originalRequest.headers.Authorization =
         `Bearer ${res.data.accessToken}`;


       return API(originalRequest);

     }

     catch {

       await clearTokens();

     }

   }

   return Promise.reject(error);

 }

);

export default API;
