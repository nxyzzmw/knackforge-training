import { createContext } from 'react';
export const userData = [
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

export const UserContext = createContext(userData);
