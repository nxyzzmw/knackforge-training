import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  SectionList,
  ActivityIndicator,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { ThemeContext } from '../contexts/ThemeProvider';

export default function Show({ navigation, route }: any) {
  const user = route?.params?.user ?? null;
  const status = route?.params?.status ?? null;

  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // API STATE
  const [apiUsers, setApiUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setApiUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= GROUP USERS BY CITY (ADDED) =================
  const usersByCity = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    apiUsers.forEach((u) => {
      const city = u.address?.city || 'Unknown';
      if (!grouped[city]) grouped[city] = [];
      grouped[city].push(u);
    });

    return Object.keys(grouped).map((city) => ({
      title: city,
      data: grouped[city],
    }));
  }, [apiUsers]);

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.container}>
          {/* USER DETAILS */}
          {user ? (
            <View style={styles.card}>
              <Text style={styles.heading}>User Details</Text>

              <Image source={{ uri: user.avatar }} style={styles.avatar} />

              <Text style={styles.name}>{user.name}</Text>
              <Text>Role: {user.role}</Text>
              <Text>About: {user.about}</Text>
              <Text>Status: {status}</Text>

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

        {/* OTHER USERS */}
        <Text style={[styles.heading, { color: isDark ? 'white' : 'black' }]}>
          OTHER USERS
        </Text>

        {/* LOADING */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text>Loading users...</Text>
          </View>
        )}

        {/* ERROR */}
        {error && (
          <View style={styles.center}>
            <Text style={{ color: 'red' }}>{error}</Text>
            <Button title="Retry" onPress={fetchUsers} />
          </View>
        )}

        {/* FLATLIST (UNCHANGED) */}
        {!loading && !error && (
          <FlatList
            data={apiUsers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card1}>
                <View style={styles.info}>
                  <Image
                    source={{
                      uri: `https://i.pravatar.cc/150?u=${item.id}`,
                    }}
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                  />
                  <Text style={styles.name}>{item.name}</Text>

                  <View style={styles.button1}>
                    <Button
                      title="View Profile"
                      onPress={() =>
                        navigation.navigate('Home', { user: item })
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          />
        )}

        {/* ================= SECTION LIST (ADDED) ================= */}
        {!loading && !error && (
          <>
            <Text
              style={[
                styles.heading,
                { marginTop: 40, color: isDark ? 'white' : 'black' },
              ]}
            >
              USERS BY CITY
            </Text>

            <SectionList
              sections={usersByCity}
              keyExtractor={(item) => item.id.toString()}
              renderSectionHeader={({ section }) => (
                <Text
                  style={[
                    styles.heading,
                    { fontSize: 18, marginBottom: 10,color: isDark ? 'white' : 'black'  },
                  ]}
                >
                  {section.title}
                </Text>
              )}
              renderItem={({ item }) => (
                <View style={styles.card1}>
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: 'gray' }}>
                      {item.email}
                    </Text>
                  </View>
                </View>
              )}
            />
          </>
        )}
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

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});
