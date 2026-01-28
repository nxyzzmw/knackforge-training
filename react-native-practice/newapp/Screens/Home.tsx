import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { ThemeContext } from '../contexts/ThemeProvider';

export default function Home() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // user list data
  const users = [
    {
      name: 'brynn',
      avatar: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
      role: 'admin',
      about: 'Loves to code!',
    },
    {
      name: 'thot leader',
      avatar:
        'https://images.pexels.com/photos/598745/pexels-photo-598745.jpeg?crop=faces&fit=crop&h=200&w=200&auto=compress&cs=tinysrgb',
      role: 'user',
      about: 'Enjoys hiking and outdoor adventures.',
    },
    {
      name: 'jsa',
      avatar: 'https://uifaces.co/our-content/donated/bUkmHPKs.jpg',
      role: 'moderator',
      about: 'Avid reader and coffee enthusiast.',
    },
    {
      name: 'talhaconcepts',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      role: 'user',
      about: 'Tech geek and gamer.',
    },
    {
      name: 'andy vitale',
      avatar: 'https://uifaces.co/our-content/donated/NY9hnAbp.jpg',
      role: 'admin',
      about: 'Passionate about photography and art.',
    },
    {
      name: 'katy friedson',
      avatar:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTgxMTc1MTYzM15BMl5BanBnXkFtZTgwNzI5NjMwOTE@._V1_UY256_CR16,0,172,256_AL_.jpg',
      role: 'user',
      about: 'Yoga instructor and wellness advocate.',
    },
  ];

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Title */}
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          USERS LIST
        </Text>

        <View style={styles.divider} />

        {/* User Cards */}
        {users.map((user, index) => (
          
  <TouchableOpacity            key={index}
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
            onPress={()=>navigation.navigate('Profile', {user})}
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
            </View>
          </TouchableOpacity>
        ))}

        {/* Navigate Button */}
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  marginTop20: {
    marginTop: 20,
    width: 200,
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
    width: 376,
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
});
