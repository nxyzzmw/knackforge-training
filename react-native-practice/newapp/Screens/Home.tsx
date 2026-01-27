import React, { useContext, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { Card } from '@rneui/themed';
import { ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

export default function Home({ navigation }: any) {
  const username = useContext(UserContext);

  const [uname, setuname] = useState(''); // typing value
  const [savedName, setSavedName] = useState(''); // saved value
  const users = [
    {
      name: 'brynn',
      avatar: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
    },
    {
      name: 'thot leader',
      avatar:
        'https://images.pexels.com/photos/598745/pexels-photo-598745.jpeg?crop=faces&fit=crop&h=200&w=200&auto=compress&cs=tinysrgb',
    },
    {
      name: 'jsa',
      avatar: 'https://uifaces.co/our-content/donated/bUkmHPKs.jpg',
    },
    {
      name: 'talhaconcepts',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      name: 'andy vitale',
      avatar: 'https://uifaces.co/our-content/donated/NY9hnAbp.jpg',
    },
    {
      name: 'katy friedson',
      avatar:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTgxMTc1MTYzM15BMl5BanBnXkFtZTgwNzI5NjMwOTE@._V1_UY256_CR16,0,172,256_AL_.jpg',
    },
  ];
  function saveit() {
    setSavedName(uname);
    setuname('');
  }

  function goToShow() {
    navigation.navigate('Show', { name: savedName }); //  send data
  }

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.heading}>Hello {username}</Text>

            <Text style={styles.marginTop10}>
              This screen is using UsernameContext
            </Text>

            <Text style={styles.marginTop20}>Name</Text>

            <TextInput
              style={styles.textInput}
              value={uname}
              onChangeText={text => setuname(text)}
              placeholder="Enter your name"
            />

            <Button title="Save" onPress={saveit} />
            <Card style={styles.card}>
              <Card.Title>Saved Name Card</Card.Title>
              <Card.Divider />
              <Text style={styles.marginBottom10}>
                {savedName
                  ? `Saved Name is: ${savedName}`
                  : 'No name saved yet.'}
              </Text>
            </Card>
            <Card style={styles.card}>
              <Card.Title>Users List</Card.Title>
              <Card.Divider />
              {users.map((user, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Image
                    resizeMode="cover"
                    source={{ uri: user.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                  <Text style={{ marginLeft: 10 }}>{user.name}</Text>
                </View>
              ))}
            </Card>
            <View style={styles.marginTop20}>
              <Button title="Go to Show Screen" onPress={goToShow} />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textInput: {
    padding: 10,
    borderColor: '#000',
    borderWidth: 1,
    margin: 12,
    color: 'black',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    padding: 20,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
    width: 'auto',
    height: 'auto',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop20: {
    marginTop: 20,
  },
  marginBottom10: {
    marginBottom: 10,
  },
});
