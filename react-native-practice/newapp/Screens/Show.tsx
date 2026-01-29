import React, { useContext } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { ThemeContext } from '../contexts/ThemeProvider';
import { UserContext } from '../contexts/UserContext';

export default function Show({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const user = route?.params?.user ?? null;

  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const users = useContext(UserContext);

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.container}>
          {/*  Show only if user exists */}
          {user ? (
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
          ) : (
            <Text style={{ color: 'grey', textAlign: 'center' }}>
              click on any user on the home screen to show it here!
            </Text>
          )}
        </View>

        {/*  Always visible */}
        <Text style={[styles.heading, { color: isDark ? 'white' : 'black' }]}>
          OTHER USERS
        </Text>

        <FlatList
          data={users}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card1}>
              <View style={styles.info}>
                <Image
                  source={{ uri: item.avatar }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
                <Text style={styles.name}>{item.name}</Text>

                <View style={styles.button1}>
                  <Button
                    title="View Profile"
                    onPress={() => navigation.navigate('Home', { user: item })}
                  />
                </View>
              </View>
            </View>
          )}
        />
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
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  button1: {
    marginTop: 10,
  },

  info: {
    alignItems: 'center',
  },

  card1: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    width: 200,
    marginRight: 15,
    marginLeft: 15,
  },

  marginTop20: {
    marginTop: 20,
    width: 120,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    marginTop: 30,
    alignItems: 'center',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
