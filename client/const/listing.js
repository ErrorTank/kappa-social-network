export const listing = [
  // item 10 pic, vehicle 20 and house 50, should consider

  //brand is option too, :v

  //Home & Garden
  {
    _id: 'Tools',
    name: 'Tools',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Furniture',
    name: 'Furniture',
    //must
    condition: true,
    brand: true,
    //option
    material: true,
  },
  {
    _id: 'Household',
    name: 'Household',
    //must
    condition: true,
    brand: true,
    //option
    color: true,
  },
  {
    _id: 'Garden',
    name: 'Garden',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Applicanes',
    name: 'Applicanes',
    //must
    condition: true,
    brand: true,
  },
  //Entertainment
  {
    _id: 'Video Games',
    name: 'Video Games',
    //must
    condition: true,
    platform: true,
  },
  {
    _id: 'Books, Movie & Music',
    name: 'Books, Movie & Music',
    //must
    condition: true,
  },
  //Clothing & Accessories
  {
    _id: 'Bags & Luggage',
    name: 'Bags & Luggage',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: "Women's Clothing & Shoe",
    name: "Women's Clothing & Shoe",
    //must
    condition: true,
    brand: true,
    //option
    size: true,
  },
  {
    _id: "Men's Clothing & Shoe",
    name: "Men's Clothing & Shoe",
    //must
    condition: true,
    brand: true,
    //option
    size: true,
  },
  {
    _id: 'Jewelry & Accessories',
    name: 'Jewelry & Accessories',
    //must
    condition: true,
    brand: true,
  },
  //Family
  {
    _id: 'Health & Beauty',
    name: 'Health & Beauty',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Pet Supplies',
    name: 'Pet Supplies',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Health & Beauty',
    name: 'Health & Beauty',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Baby & Kids',
    name: 'Baby & Kids',
    //must
    condition: true,
    brand: true,
    //option
    size: true,
  },
  {
    _id: 'Toy & Games',
    name: 'Toy & Games',
    //must
    condition: true,
    brand: true,
  },
  //Electronics
  {
    _id: 'Electronics & Computers',
    name: 'Electronics & Computers',
    //must
    condition: true,
    brand: true,
    //option
    size: true,
  },
  {
    _id: 'Mobile Phones',
    name: 'Mobile Phones',
    //must
    condition: true,
    carrie: true,
    deviceName: true,
  },
  //Hobbies
  {
    _id: 'Bicycles',
    name: 'Bicycles',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Arts & Crafts',
    name: 'Arts & Crafts',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Sports & Outdoors',
    name: 'Sports & Outdoors',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Auto Parts',
    name: 'Auto Parts',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Musical Instruments',
    name: 'Musical Instruments',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Antiques & Collectibles',
    name: 'Antiques & Collectibles',
    //must
    condition: true,
    brand: true,
  },
  //Classifieds
  {
    _id: 'Garage Sale',
    name: 'Garage Sale',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Miscellaneous',
    name: 'Miscellaneous',
    //must
    condition: true,
    brand: true,
  },

  //Vehicle
  {
    _id: 'Vehicle',
    name: 'Vehicle',
    //must
    vehicleType: true,
    year: true,
    make: true,
    //make + year + model = title
    model: true,
    mileage: true,

    //option
    //vehicleIdentificationNumber: true, (only for motocycle and car)
    //nothing else here
  },

  //Home is a little different

  //Home for Rent/Sale
  {
    _id: 'Home for Rent',
    name: 'Home for Rent',
    //must
    homeFor: true,
    homeType: true,
    numberOfBedrooms: true,
    numberOfBathrooms: true,
    pricePerMonth: true,
    address: true,
    decription: true,
    //option
    squareFeet: true,
    dateAvailable: true,
    laundryType: true,
    parkingType: true,
    airConditioningType: true,
    heatingType: true,
    catFriendly: true,
    dogFriendly: true,
  },
  {
    _id: 'Home for Sale',
    name: 'Home for Sale',
    //must
    homeFor: true,
    homeType: true,
    numberOfBedrooms: true,
    numberOfBathrooms: true,
    price: true,
    address: true,
    decription: true,
    //option
    squareFeet: true,
    dateAvailable: true,
    laundryType: true,
    parkingType: true,
    airConditioningType: true,
    heatingType: true,
    catFriendly: true,
    dogFriendly: true,
  },
];
