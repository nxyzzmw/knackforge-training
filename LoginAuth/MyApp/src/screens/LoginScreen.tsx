import React, { useState } from "react";
import { router } from "expo-router";

import { StyleSheet, View, Alert } from "react-native";

import {
 Card,
 Text,
 TextInput,
 Button,
} from "react-native-paper";


import API from "../api/axiosInstance";

import { saveTokens } from "../storage/keychain";

import { useDispatch } from "react-redux";

import { setTokens } from "../redux/authSlice";

import { AppDispatch } from "../redux/store";


export default function Login() {


 const dispatch = useDispatch<AppDispatch>();


 const [username, setUsername] =

  useState<string>("");


 const [password, setPassword] =

  useState<string>("");


 const [loading, setLoading] =

  useState<boolean>(false);
const handleLogin = async () => {

const res = await API.post("/auth/login", {

username,

password,

expiresInMins: 30,

});


await saveTokens(

res.data.accessToken,

res.data.refreshToken

);


dispatch(setTokens({

accessToken: res.data.accessToken,

refreshToken: res.data.refreshToken,

}));


router.replace("/home");

};

 

 return (

  <View style={styles.container}>


   <Text style={styles.paragraph}>

    Login

   </Text>


   <Card style={styles.card}>


    <Card.Content>


     <TextInput

      label="Username"

      value={username}

      onChangeText={setUsername}

      style={styles.input}

     />


     <TextInput

      label="Password"

      value={password}

      onChangeText={setPassword}

      secureTextEntry

      style={styles.input}

     />


     <Button

      mode="contained"

      onPress={handleLogin}

      loading={loading}

     >

      Login

     </Button>


    </Card.Content>


   </Card>


  </View>

 );

}


const styles = StyleSheet.create({

 container: {

  flex: 1,

  justifyContent: "center",

  backgroundColor: "#ecf0f1",

  padding: 8,

 },


 paragraph: {

  margin: 24,

  fontSize: 18,

  fontWeight: "bold",

  textAlign: "center",

 },


 card: {

  padding: 10,

 },


 input: {

  marginBottom: 12,

 },

});
