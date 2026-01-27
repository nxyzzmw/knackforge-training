import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { UserContext } from "../contexts/UserContext";
import { Card } from '@rneui/themed';
import ScreenWrapper from "../components/ScreenWrapper";

export default function Show({ navigation , route}: any) {
  const username = useContext(UserContext);
  const { name } = route?.params || {};
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.card}>
        <Text style={styles.heading}>
          Show Screen
        </Text>

        <Text style={styles.marginTop10}>
          Username from Context: {username}
        </Text>
            <Card>
              <Card.Title>Received Name Card</Card.Title>
              <Card.Divider />
              <Text style={styles.marginBottom10}>
                {name ? `Received Name is: ${name}` : 'No name received yet.'}
              </Text>
            </Card>

        <View style={styles.marginTop20}>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
        </View>
      </View>
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
  },
  marginTop10: {
    marginTop: 10,
  },
  receivedName: {
    fontSize: 22,
  },
  marginTop20: {
    marginTop: 20,
  },
  marginBottom10: {
    marginBottom: 10,
  },
   card:{
    backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 4,
        },padding: 20,
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 14,
        width: "auto",
        height: "auto",
        marginTop: 30,
        
  },
});
