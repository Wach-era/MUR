const mongoose = require('mongoose');
require('dotenv').config();
const Item = require('./models/Item');

mongoose.connect(process.env.MONGO_URI);

const sampleItems = [
  {
    title: 'Rumours',
    artist: 'Fleetwood Mac',
    format: 'Vinyl',
    genre: ['Rock', 'Pop Rock'],
    releaseYear: 1977,
    price: 34.99,
    stockQuantity: 1,
    isPreOwned: true,
    condition: {
      mediaGrade: 'Very Good+',
      sleeveGrade: 'Very Good',
      description: 'Minor shelf wear on cover corners. Vinyl surface has faint sleeve scuffs but plays crisp and clean.',
    },
    details: {
      label: 'Warner Bros.',
      pressingInfo: '1977 US Original Pressing (Textured Sleeve)',
      tracklist: ['Second Hand News', 'Dreams', 'Never Going Back Again', "Don't Stop", 'Go Your Own Way', 'The Chain'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'AM',
    artist: 'Arctic Monkeys',
    format: 'Vinyl',
    genre: ['Indie Rock'],
    releaseYear: 2013,
    price: 29.99,
    stockQuantity: 5,
    isPreOwned: false,
    condition: {
      mediaGrade: 'Mint',
      sleeveGrade: 'Mint',
      description: 'Factory sealed brand new copy.',
    },
    details: {
      label: 'Domino',
      pressingInfo: '180g Heavyweight Black Vinyl',
      tracklist: ['Do I Wanna Know?', 'R U Mine?', 'One For The Road', 'Arabella'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Abbey Road',
    artist: 'The Beatles',
    format: 'CD',
    genre: ['Rock', 'Classic Rock'],
    releaseYear: 1969,
    price: 14.50,
    stockQuantity: 3,
    isPreOwned: true,
    condition: {
      mediaGrade: 'Near Mint',
      sleeveGrade: 'Very Good+',
      description: 'Jewel case has slight scratching, CD disc is in pristine condition.',
    },
    details: {
      label: 'Apple Records',
      pressingInfo: '2009 Remastered Edition CD',
      tracklist: ['Come Together', 'Something', 'Maxwell\'s Silver Hammer', 'Here Comes The Sun'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Vintage World Tour Graphic Tee',
    artist: 'The Neighbourhood',
    format: 'Merchandise',
    genre: ['Alternative'],
    releaseYear: 2022,
    price: 40.00,
    stockQuantity: 10,
    isPreOwned: false,
    condition: {
      mediaGrade: 'N/A',
      sleeveGrade: 'N/A',
      description: '100% Heavyweight Cotton, Screenprinted front and back graphics.',
    },
    details: {
      label: 'Official Band Merch',
      pressingInfo: 'Size: Unisex L',
      tracklist: [],
    },
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
  },
];

const importData = async () => {
  try {
    await Item.deleteMany();
    await Item.insertMany(sampleItems);
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();