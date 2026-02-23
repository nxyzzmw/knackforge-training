import * as SecureStore from "expo-secure-store";

import { Tokens } from "../types/authTypes";

const KEY = "authTokens";


export const saveTokens = async (

 accessToken: string,

 refreshToken: string

): Promise<void> => {

 const tokens: Tokens = {

  accessToken,

  refreshToken,

 };

 await SecureStore.setItemAsync(

  KEY,

  JSON.stringify(tokens)

 );

};


export const getTokens = async ():

Promise<Tokens | null> => {

 const data =

 await SecureStore.getItemAsync(KEY);

 if (!data) return null;

 return JSON.parse(data);

};


export const clearTokens = async () => {

 await SecureStore.deleteItemAsync(KEY);

};
