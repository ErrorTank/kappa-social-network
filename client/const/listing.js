import React, { Component } from 'react';
export const itemField = [
  {
    name: 'Tiêu đề',
    englishName: 'title',
  },
  {
    name: 'Giá',
    englishName: 'price',
  },
  {
    name: 'Hạng mục',
    englishName: 'category',
    isSelected: true,
    options: [
      {
        name: 'Nhà & vườn',
        icon: 'fas fa-home-lg-alt',
        isDisabled: true,
      },
      {
        name: 'Công cụ',
      },
      {
        name: 'Nội thất',
      },
      {
        name: 'Hộ gia đình',
      },
      {
        name: 'Vườn',
      },
      {
        name: 'Thiết bị',
      },
      {
        name: 'Giải trí',
        icon: 'fas fa-gamepad-alt',
        isDisabled: true,
      },
      {
        name: 'Trò chơi điện tử',
      },
      {
        name: 'Sách, phim & nhạc',
      },
      {
        name: 'Quần áo và phụ kiện',
        icon: 'fas fa-backpack',
      },
      {
        name: 'Túi & hành lý',
      },
      {
        name: 'Quần áo & giầy dép nữ',
      },
      {
        name: 'Quần áo & giầy dép nam',
      },
      {
        name: 'Trang sức & phụ kiện',
      },
      {
        name: 'Gia đình',
        icon: 'fas fa-heart',
        isDisabled: true,
      },
      {
        name: 'Sức khỏe & làm đẹp',
      },
      {
        name: 'Đồ dùng cho thú cưng',
      },
      {
        name: 'Trẻ sơ sinh & trẻ nhỏ',
      },
      {
        name: 'Đồ chơi & trò chơi',
      },
      {
        name: 'Đồ điện tử',
        icon: 'fas fa-mobile-alt',
        isDisabled: true,
      },
      {
        name: 'Điện tử & máy tính',
      },
      {
        name: 'Điện thoại di động',
      },
      {
        name: 'Sở thích',
        icon: 'fas fa-guitar',
        isDisabled: true,
      },
      {
        name: 'Xe đạp',
      },
      {
        name: 'Thủ công mỹ nghệ',
      },
      {
        name: 'Thể thao & hoạt động ngoài trời',
      },
      {
        name: 'Phụ tùng xe hơi',
      },
      {
        name: 'Nhạc cụ',
      },
      {
        name: 'Đồ cổ và bộ sưu tập',
      },
      {
        name: 'Rao vặt',
        icon: 'fas fa-binoculars',
        isDisabled: true,
      },
      {
        name: 'Thanh lý đồ cũ',
      },
      {
        name: 'hỗn hợp',
      },
      {
        name: 'Phương tiện',
        icon: 'fas fa-car',
        isDisabled: true,
        link: '/marketplace/create/vehicle',
      },
      {
        name: 'Nhà đất',
        icon: 'fas fa-home',
        isDisabled: true,
        link: '/marketplace/create/rental',
      },
    ],
  },

  // category special input

  {
    name: 'Tình Trạng',
    englishName: 'condition',
    isSelected: true,
    categoryDepend: true,
    options: [
      { name: 'Mới' },
      { name: 'Đã qua sử dụng - Như mới' },
      { name: 'Đã qua sử dụng - Tốt' },
      { name: 'Đã qua sử dụng - Khá tốt' },
    ],
  },
  {
    name: 'Thương hiệu',
    englishName: 'brand',
    categoryDepend: true,
  },
  {
    name: 'Chất liệu',
    englishName: 'material',
    isSelected: true,
    categoryDepend: true,
    options: [
      { name: 'Gỗ' },
      { name: 'Kim loại' },
      { name: 'Thủy tinh' },
      { name: 'Da' },
      { name: 'Vải sợi' },
      { name: 'Đá' },
      { name: 'Nhựa' },
      { name: 'Tre' },
      { name: 'Wicker' },
      { name: 'Không rõ' },
    ],
  },

  //
  {
    name: 'Mô tả',
    englishName: 'decription',
    isTextArea: true,
  },
  {
    name: 'Tình trạng hàng',
    englishName: 'availability',
    isSelected: true,
    options: [
      { name: 'Niêm yết là chỉ còn 1 mặt hàng' },
      { name: 'Niêm yết là còn hàng' },
      //  { name: 'Niêm yết là hết hàng' },
    ],
  },
];

export const fieldByCategory = [
  // item 10 pic, vehicle 20 and house 50, should consider

  //brand is option too, :v

  //Home & Garden
  {
    _id: 'Tools',
    name: 'Công cụ',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Furniture',
    name: 'Nội thất',
    //must
    condition: true,
    brand: true,
    //option
    material: true,
  },
  {
    _id: 'Household',
    name: 'Hộ gia đình',
    //must
    condition: true,
    brand: true,
    //option
    color: true,
  },
  {
    _id: 'Garden',
    name: 'Vườn',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Applicanes',
    name: 'Thiết bị',
    //must
    condition: true,
    brand: true,
  },
  //Entertainment
  {
    _id: 'Video Games',
    name: 'Trò chơi điện tử',
    //must
    condition: true,
    platform: true,
  },
  {
    _id: 'Books, Movie & Music',
    name: 'Sách, phim & nhạc',
    //must
    condition: true,
  },
  //Clothing & Accessories
  {
    _id: 'Bags & Luggage',
    name: 'Túi & hành lý',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: "Women's Clothing & Shoe",
    name: 'Quần áo & giầy dép nữ',
    //must
    condition: true,
    brand: true,
    //option
    size: true,
  },
  {
    _id: "Men's Clothing & Shoe",
    name: 'Quần áo & giầy dép nam',
    //must
    condition: true,
    brand: true,
    //option
    size: true,
  },
  {
    _id: 'Jewelry & Accessories',
    name: 'Trang sức & phụ kiện',
    //must
    condition: true,
    brand: true,
  },
  //Family
  {
    _id: 'Health & Beauty',
    name: 'Sức khỏe & làm đẹp',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Pet Supplies',
    name: 'Đồ dùng cho thú cưng',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Baby & Kids',
    name: 'Trẻ sơ sinh & trẻ nhỏ',
    //must
    condition: true,
    brand: true,
    //option
    size: true,
  },
  {
    _id: 'Toy & Games',
    name: 'Đồ chơi và trò chơi',
    //must
    condition: true,
    brand: true,
  },

  //below part didn't get add and fix yet

  //Electronics
  {
    _id: 'Electronics & Computers',
    name: 'Điện tử & máy tính',
    //must
    condition: true,
    brand: true,
    //option
    size: true,
  },
  {
    _id: 'Mobile Phones',
    name: 'Điện thoại di động',
    //must
    condition: true,
    carrie: true,
    deviceName: true,
  },
  //Hobbies
  {
    _id: 'Bicycles',
    name: 'Xe đạp',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Arts & Crafts',
    name: 'Thủ công mỹ nghệ',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Sports & Outdoors',
    name: 'Thể thao & hoạt động ngoài trời',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Auto Parts',
    name: 'Phụ tùng xe hơi',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Musical Instruments',
    name: 'Nhạc cụ',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Antiques & Collectibles',
    name: 'Đồ cổ và bộ sưu tập',
    //must
    condition: true,
    brand: true,
  },
  //classNameifieds
  {
    _id: 'Garage Sale',
    name: 'Thanh lý đồ cũ',
    //must
    condition: true,
    brand: true,
  },
  {
    _id: 'Miscellaneous',
    name: 'hỗn hợp',
    //must
    condition: true,
    brand: true,
  },
];

export const listingVehicle = [
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
];

export const listingHome = [
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
    pricePerMonth: true, //
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
    price: true, //
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
