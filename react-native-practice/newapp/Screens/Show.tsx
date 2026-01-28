import React from "react";
import { View, Text, Button, StyleSheet, Image, ScrollView } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";

export default function Show({ navigation, route }: { navigation: any; route: any }) {
  const user = route?.params?.user;

  if (!user) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <Text style={styles.heading}>No user data received</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>User Details</Text>

          <Image source={{ uri: user.avatar }} style={styles.avatar} />

          <Text style={styles.name}>{user.name}</Text>
          <Text>Role: {user.role}</Text>
          <Text>About: {user.about}</Text>

          <View style={styles.marginTop20}>
            <Button title="Go Back" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  marginTop20: {
    marginTop: 20,
    width: 200,
    alignSelf: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    marginTop: 30,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
