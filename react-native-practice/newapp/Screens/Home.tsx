import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { ThemeContext } from '../contexts/ThemeProvider';
import { UserContext } from '../contexts/UserContext';

export default function Home() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const users = useContext(UserContext);

  // store status per user
  const [status, setStatus] = useState<Record<number, string>>( "",
  );

  // toggle per user
  const toggleStatus = (index: number) => {
    setStatus(prev => ({
      ...prev,
      [index]: prev[index] === "Online" ? "Offline" : "Online",
    }));
  };

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          USERS LIST
        </Text>

        <View style={styles.divider} />

        {users.map((user, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.userCard,
              {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: isDark ? 0.8 : 0.3,
                shadowRadius: 8,
                elevation: 8,
              },
            ]}
            onPress={() =>
              navigation.navigate('Profile' as never, {
                user,
                status: status[index] || "Offline",
              } as never)
            }
          >
            <Image source={{ uri: user.avatar }} style={styles.avatar} />

            <View style={styles.userInfo}>
              <Text>
                <Text style={styles.label}>Name:</Text> {user.name}
              </Text>

              <Text>
                <Text style={styles.label}>Role:</Text> {user.role}
              </Text>

              <Text>
                <Text style={styles.label}>About:</Text> {user.about}
              </Text>

              <Text>
                <Text style={styles.label}> Status:</Text>
                <Text
                  style={{
                    color:
                      (status[index] || "Offline") === 'Online'
                        ? 'green'
                        : '#ff0000',
                  }}
                >
                  {" "}{status[index] || "Offline"}
                </Text>
              </Text>
<View style={styles.button}>
   <Button
                title="Toggle Status"
                onPress={() => toggleStatus(index)}
              />
</View>
             
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.marginTop20}>
          <Button
            title="Go To Profile"
            onPress={() => navigation.navigate('Profile' as never)}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  marginTop20: {
    marginTop: 20,
    width: 150,
    alignSelf: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: 300,
    marginTop: 30,
    alignSelf: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
  },
  userInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
  },
  button:{
    marginTop:10,
    width:"auto",
    height:50,
  },
});
