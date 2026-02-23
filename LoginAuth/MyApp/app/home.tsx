import { View, Text, Button } from "react-native";

import { router } from "expo-router";

import { clearTokens } from "../src/storage/keychain";


export default function Home() {

 const logout = async () => {

  await clearTokens();

  router.replace("/");

 };


 return (

  <View

   style={{

    flex: 1,

    justifyContent: "center",

    alignItems: "center",

   }}

  >

   <Text>Home Screen ✅</Text>

   <Button

    title="Logout"

    onPress={logout}

   />

  </View>

 );

}
