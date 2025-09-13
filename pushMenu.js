// pushMenu.js
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

// Firebase configuration (match your firebase.ts config)
const firebaseConfig = {
  apiKey: "AIzaSyB8d2gALUeT7TIIQCDN4WJe47wwRuzEWHo",
  authDomain: "lecielnew.firebaseapp.com",
  projectId: "lecielnew",
  storageBucket: "lecielnew.firebasestorage.app",
  messagingSenderId: "684192350714",
  appId: "1:684192350714:web:113f24c8c543617527e443",
  measurementId: "G-JKLTDZY5MH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Menu items (without the numeric id field)
const menuItems = [
  { name: 'Mango Frozen', price: '$4', category: 'Cold Drinks' },
  { name: 'Strawberry Frozen', price: '$4', category: 'Cold Drinks' },
  { name: 'Pineapple Frozen', price: '$4', category: 'Cold Drinks' },
  { name: 'Mango & Strawberry', price: '$4', category: 'Cold Drinks' },
  { name: 'Fresh Orange', price: '$3', category: 'Cold Drinks' },
  { name: 'Lemonade', price: '$3', category: 'Cold Drinks' },
  { name: 'Minted Lemonade', price: '$3.5', category: 'Cold Drinks' },
  { name: 'Apple', price: '$3', category: 'Cold Drinks' },
  { name: 'Passion Fruit', price: '$3', category: 'Cold Drinks' },
  { name: 'Mocha Frappe', price: '$5', category: 'Cold Drinks' },
  { name: 'Orea Milkshake', price: '$5', category: 'Cold Drinks' },
  { name: 'Iced Coffee', price: '$3.5', category: 'Cold Drinks' },
  { name: 'Iced Latte', price: '$4', category: 'Cold Drinks' },
  { name: 'Chocolate Cake', price: '$6', category: 'Cold Drinks' },
  { name: 'Iced Mocha', price: '$3.5', category: 'Cold Drinks' },
  { name: 'Peach Iced Tea', price: '$3.5', category: 'Cold Drinks' },
  { name: 'Laziza', price: '$3', category: 'Cold Drinks' },
  { name: 'Mexican Laziza', price: '$3.5', category: 'Cold Drinks' },
  { name: 'Boom Boom', price: '$3.5', category: 'Cold Drinks' },
  { name: 'Dark Blue', price: '$3', category: 'Cold Drinks' },
  { name: 'Red Bull', price: '$5', category: 'Cold Drinks' },
  { name: 'Freez', price: '$3', category: 'Cold Drinks' },
  { name: 'Mr.Juicy', price: '$0.5', category: 'Cold Drinks' },
  { name: 'Pepsi', price: '$2', category: 'Cold Drinks' },
  { name: 'Mirinda', price: '$2', category: 'Cold Drinks' },
  { name: '7Up', price: '$2', category: 'Cold Drinks' },
  { name: 'Water(Small)', price: '$1', category: 'Cold Drinks' },
  { name: 'Water(Big)', price: '$2', category: 'Cold Drinks' },
  { name: '+ Grenadine', price: '$0.5', category: 'Cold Drinks' },
  { name: 'Tea', price: '$1.5', category: 'Hot Drinks' },
  { name: 'Coffee', price: '$1.5', category: 'Hot Drinks' },
  { name: 'Nescafe', price: '$3', category: 'Hot Drinks' },
  { name: 'Nescafe 3in1', price: '$3', category: 'Hot Drinks' },
  { name: 'Nescafe 2in1', price: '$3', category:'Hot Drinks' },
  { name: 'Cappucino', price: '$3.5', category: 'Hot Drinks' },
  { name: 'Hot Chocolate', price: '$3.5', category: 'Hot Drinks' },
  { name: 'Latte', price: '$4', category: 'Hot Drinks' },
  { name: 'Zhurat', price: '$1.5', category: 'Hot Drinks' },
  { name: 'Zhurat (Cumin&Lemon)', price: '$1.5', category: 'Hot Drinks' },
  { name: 'Sahlab', price: '$2', category: 'Hot Drinks' },
  { name: 'Le Ciel Cocktail', price: '$7', category: 'Alcohol' },
  { name: 'Vodka', price: '$5', category: 'Alcohol' },
  { name: 'Passion Fruit', price: '$5', category: 'Alcohol' },
  { name: 'Jamaica', price: '$6', category: 'Alcohol' },
  { name: 'Mojito', price: '$6', category: 'Alcohol' },
  { name: 'Baileys', price: '$6', category: 'Alcohol' },
  { name: 'Whiskey Black', price: '$6', category: 'Alcohol' },
  { name: 'Whiskey Chivas', price: '$6', category: 'Alcohol' },
  { name: 'Whiskey Red Label', price: '$5', category: 'Alcohol' },
  { name: 'Gin Basil', price: '6', category: 'Alcohol' },
  { name: 'Watermelon Gin', price: '$6', category: 'Alcohol' },
  { name: 'Strawberry smash', price: '$6', category: 'Alcohol' },
  { name: 'Almaza', price: '$3', category: 'Alcohol' },
  { name: 'Mexican Almaza', price: '$3.5', category: 'Alcohol' },
  { name: 'Tequila sunrise', price: '$6', category: 'Alcohol' },
  { name: 'Margarita', price: '$6', category: 'Alcohol' },
  { name: 'Sex on the beach', price: '$6', category: 'Alcohol' },
  { name: 'Shots', price: '$3.5', category: 'Alcohol' },
  { name: 'Cheese', price: '$3.5', category: 'Sajj' },
  { name: 'kafta', price: '$4.5', category: 'Sajj' },
  { name: 'Zaatar', price: '$1.5', category: 'Sajj' },
  { name: 'Keshek', price: '$3', category: 'Sajj' },
  { name: 'Cocktail', price: '$3', category: 'Sajj' },
  { name: 'Banadura & Basal', price: '$3', category: 'Sajj' },
  { name: 'Labneh', price: '$2.5', category: 'Sajj' },
  { name: 'Labneh & Zaatar', price: '$3', category: 'Sajj' },
  { name: 'Martadilla & Ashawen', price: '$4', category: 'Sajj' },
  { name: 'Habash & Ashawen', price: '$4', category: 'Sajj' },
  { name: 'Nutella', price: '$5', category: 'Sajj' },
  { name: '+ Cheese', price: '$0.5', category: 'Sajj' },
  { name: '+ Vegetables', price: '$0.5', category: 'Sajj' },
  { name: 'Lebanese Burger', price: '$7', category: 'Sandwiches' },
  { name: 'Crispy', price: '$6', category: 'Sandwiches' },
  { name: 'Tawouk', price: '$6', category: 'Sandwiches' },
  { name: 'Batata', price: '$4', category: 'Sandwiches' },
  { name: 'Lebanese Burger Plate', price: '$8', category: 'Plates' },
  { name: 'Crispy Plate', price: '$8', category: 'Plates' },
  { name: 'Tawouk Plate', price: '$8', category: 'Plates' },
  { name: 'Batata Plate', price: '$3', category: 'Plates' },
  { name: 'Nuts', price: '$2', category: 'Crackers' },
  { name: 'Carrots', price: '$2', category: 'Crackers' },
  { name: 'Chinese Nuts', price: '$2', category: 'Crackers' },
  { name: 'Tormos', price: '$2', category: 'Crackers' },
  { name: 'Rez b Halib', price: '$3.5', category: 'Desserts' },
  { name: 'Jello', price: '$2.5', category: 'Desserts' },
  { name: 'Castard', price: '$3.5', category: 'Desserts' },
  { name: 'Tefeh', price: '$6', category: 'Shisha' },
  { name: 'Tefeh Nakhli', price: '$5', category: 'Shisha' },
  { name: 'Grape & Mint', price: '$5', category: 'Shisha' },
  { name: 'Ajami', price: '$7', category: 'Shisha' },
  { name: 'Nak-ha', price: '$7', category: 'Shisha' },
  { name: 'Tefeh head change', price: '$3', category: 'Shisha' },
  { name: 'Ajami head change', price: '$3.5', category:'Shisha' },
  { name: 'Plastic Nabrish', price: '$1.5', category: 'Shisha' },
];

async function pushMenu() {
  for (const item of menuItems) {
    await addDoc(collection(db, "menu"), item);
  }
  console.log("Menu pushed to Firestore successfully!");
}

pushMenu().catch(console.error);
