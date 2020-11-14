import React, { Component } from 'react';
import { addressApi } from './../api/common/address-api';
import { userInfo } from './../common/states/common';

export let itemField = [
  {
    name: 'Tiêu đề',
    englishName: 'title',
    error: {
      required: 'Vui lòng nhập tiêu đề hợp lệ.',
    },
  },
  {
    name: 'Giá',
    englishName: 'price',
    error: {
      required: 'Nhập giá cho mặt hàng của bạn.',
    },
    contentEditable: true,
    numberOnly: true,
    isMoney: true,
  },
  {
    name: 'Hạng mục',
    englishName: 'category',
    isSelected: true,
    error: {
      required: 'Vui lòng chọn giá trị hợp lệ.',
    },
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
        name: 'Quần áo & phụ kiện',
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
        name: 'Đồ cổ & bộ sưu tập',
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
        name: 'Hỗn hợp',
      },
      {
        name: 'Xe cộ',
        icon: 'fas fa-car',
        isDisabled: true,
        link: '/marketplace/create/vehicle',
      },
      {
        name: 'Nhà đất',
        icon: 'fas fa-home',
        isDisabled: true,
        link: '/marketplace/create/home',
      },
    ],
  },

  // category special input

  {
    name: 'Tình Trạng',
    englishName: 'condition',
    isSelected: true,
    isDepended: true,
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
    isDepended: true,
  },
  {
    name: 'Chất liệu',
    englishName: 'material',
    isSelected: true,
    isDepended: true,
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
  {
    name: 'Màu sắc',
    englishName: 'color',
    isSelected: true,
    isDepended: true,
    options: [
      { name: 'Đen' },
      { name: 'Trắng' },
      { name: 'Đỏ' },
      { name: 'Khác' },
      //more
    ],
  },
  {
    name: 'Nền tảng',
    englishName: 'platform',
    isSelected: true,
    isDepended: true,
    options: [
      { name: 'PlayStation 4' },
      { name: 'Xbox One' },
      { name: 'Máy Tính' },
      { name: 'Khác' },
      //more
    ],
  },
  {
    name: 'Kích thước',
    englishName: 'size',
    isDepended: true,
  },
  {
    name: 'Nhà mạng',
    englishName: 'carrie',
    isSelected: true,
    isDepended: true,
    options: [
      { name: 'VNPT' }, // fake :V
      { name: 'Viettel' },
      { name: 'Khác' },
      //more
    ],
  },
  {
    name: 'Tên thiết bị',
    englishName: 'deviceName',
    isSelected: true,
    isDepended: true,
    options: [
      { name: 'IPhone XR' },
      { name: 'IPhone X' },
      { name: 'Khác' },
      //more
    ],
  },
  //
  {
    name: 'Mô tả',
    englishName: 'decription',
    isTextArea: true,
  },

  //special, need to build later
  {
    name: 'Vị trí',
    englishName: 'location',
    isSelected: true,
    options: [],
    default: 'Hà Nội',
    error: {
      required: 'Vui lòng chọn giá trị hợp lệ.',
    },
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
    default: 'Niêm yết là chỉ còn 1 mặt hàng',
    error: {
      required: 'Vui lòng chọn giá trị hợp lệ.',
    },
  },
];

export const fieldByCategory = [
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
    name: 'Đồ chơi & trò chơi',
    //must
    condition: true,
    brand: true,
  },

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
    name: 'Đồ cổ & bộ sưu tập',
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

export let vehicleField = [
  //Vehicle
  {
    name: 'Số khung(không bắt buộc)',
    englishName: 'vehicleIdentificationNumber',
    isDepended: true,
    neededLength: 17,
    error: {
      needed_length: 'VIN hợp lệ cần có 17 ký tự',
    },
  },
  {
    name: 'Loại xe',
    // englishName: 'vehicleType',
    englishName: 'category',
    isSelected: true,
    error: {
      required: 'Vui lòng chọn giá trị hợp lệ.',
    },
    options: [
      { name: 'Xe hơi/Xe tải' },
      { name: 'Xe máy' },
      { name: 'Xe mô tô thể thao' },
      { name: 'RV/Nhà xe lưu động' },
      { name: 'Xe moóc' },
      { name: 'Thuyền' },
      { name: 'Thương mại/Công nghiệp' },
      { name: 'Khác' },
    ],
  },
  //make + year + model = title
  {
    name: 'Năm',
    englishName: 'year',
    isSelected: true,
    error: {
      required: 'Vui lòng chọn giá trị hợp lệ.',
    },
    options: [
      { name: '2021' },
      { name: '2020' },
      { name: '2019' },
      { name: '2018' },
      { name: '2017' },
      { name: '2016' },
      { name: '2015' },
      { name: '2014' },
      { name: '2013' },
      { name: '2012' },
      { name: '2011' },
      { name: '2010' },
      //more
    ],
  },
  {
    name: 'Hãng',
    englishName: 'make',
    error: {
      required: 'Hãy thêm hãng phương tiện.',
    },
  },
  {
    name: 'Mẫu xe',
    englishName: 'model',
    error: {
      required: 'Hãy thêm dòng phương tiện.',
    },
  },
  {
    name: 'Kiểu thân xe',
    englishName: 'bodyType',
    isSelected: true,
    isDepended: true,
    error: {
      required: 'Vui lòng chọn giá trị hợp lệ.',
    },
    options: [
      { name: 'Ô tô 2 cửa' },
      { name: 'Xe tải' },
      { name: 'Xedan' },
      { name: 'Khác' },
      //more
    ],
  },
  {
    name: 'Số dặm đã đi',
    englishName: 'mileage',
    isDepended: true,
    min: 300,
    max: 1000000,
    error: {
      required: 'Hãy thêm số dặm mà phương tiện đã đi được.',
      min_value: 'Vui lòng thêm số dặm đã đi trong khoảng 300 - 1.000.000 km.',
      max_value: 'Vui lòng thêm số dặm đã đi trong khoảng 300 - 1.000.000 km.',
    },
  },
  {
    name: 'Hộp số',
    englishName: 'tranmission',
    isSelected: true,
    isDepended: true,
    options: [{ name: 'Hộp số tự động' }, { name: 'Hộp số sàn' }],
  },
  {
    name: 'Loại nhiên liệu',
    englishName: 'fuelType',
    isSelected: true,
    isDepended: true,
    options: [
      { name: 'Diesel' },
      { name: 'Điện' },
      { name: 'Xăng' },
      { name: 'Khác' },
      //more
    ],
  },
  {
    name: 'Tình trạng xe',
    englishName: 'vehicleCondition',
    isSelected: true,
    isDepended: true,
    options: [
      { name: 'Tuyệt vời' },
      { name: 'Rất tốt' },
      { name: 'Tốt' },
      { name: 'Trung bình' }, // thêm
      { name: 'Kém' },
    ],
  },

  // vị trí ở đây
  {
    name: 'Vị trí',
    englishName: 'location',
    isSelected: true,
    error: {
      required: 'Vui lòng chọn giá trị hợp lệ.',
    },
    default: 'Hà Nội',
  },

  {
    name: 'Giá',
    englishName: 'price',
    error: {
      required: 'Nhập giá cho mặt hàng của bạn.',
    },
    contentEditable: true,
    numberOnly: true,
    isMoney: true,
  },
  {
    name: 'Mô tả',
    englishName: 'decription',
    isTextArea: true,
  },
];

export const fieldByVehicleType = [
  //Car/Truck
  {
    _id: 'Car/Truck',
    name: 'Xe hơi/Xe tải',
    //must
    bodyStyle: true,
    mileage: true,
    tranmission: true,
    fuelType: true,
    vehicleCondition: true,
    //option
    vehicleIdentificationNumber: true,
  },
  {
    _id: 'Motorcycle',
    name: 'Xe máy',
    //must
    mileage: true,
    fuelType: true,
    vehicleCondition: true, // tự thêm :v
    //option
    vehicleIdentificationNumber: true,
  },
  {
    _id: 'Powersport',
    name: 'Xe mô tô thể thao',
    //must
    fuelType: true,
    //option
  },
  {
    _id: 'RV/Camper',
    name: 'RV/Nhà xe lưu động',
    //must
    fuelType: true,
    //option
  },
  {
    _id: 'Trailer',
    name: 'Xe moóc',
    //must
    //option
  },
  {
    _id: 'Commercial/Industrial',
    name: 'Thương mại/Công nghiệp',
    //must
    fuelType: true,
    //option
  },
  {
    _id: 'Other',
    name: 'Khác',
    //must
    //option
  },
];

export const homeField = [
  //Home is a little different
  {
    name: 'Nhà dùng để',
    // englishName: 'homeFor',
    englishName: 'category',
    isSelected: true,
    options: [{ name: 'Bán nhà' }, { name: 'Cho thuê' }],
    error: {
      required: 'Vui lòng chọn giá trị hợp lệ.',
    },
  },
  {
    name: 'Loại tài sản',
    englishName: 'homeType',
    isSelected: true,
    error: {
      required: 'Vui lòng chọn giá trị hợp lệ.',
    },
    options: [
      { name: 'Nhà' },
      { name: 'Nhà liền kề' },
      { name: 'Căn hộ/Căn hộ cao cấp' },
      { name: 'Phòng' },
    ],
  },
  {
    name: 'Số phòng ngủ',
    englishName: 'numberOfBedrooms',
    numberOnly: true,
    error: {
      required: 'Vui lòng nhập số phòng ngủ.',
    },
  },
  {
    name: 'Số phòng tắm',
    englishName: 'numberOfBathrooms',
    numberOnly: true,
    error: {
      required: 'Vui lòng nhập số phòng tắm.',
    },
  },
  // {
  //   name: 'Giá mỗi tháng',
  //   englishName: 'pricePerMonth',
  //   isDepended: true,
  //   contentEditable: true,
  //   numberOnly: true,
  //   isMoney: true,
  //   error: {
  //     required: 'Vui lòng nhập giá tài sản cho thuê.',
  //   },
  // },
  {
    name: 'Giá',
    englishName: 'price',
    // isDepended: true,
    contentEditable: true,
    numberOnly: true,
    isMoney: true,
    error: {
      required: 'Vui lòng nhập giá tài sản',
    },
  },
  //special, need to build later
  {
    name: 'Địa chỉ tài sản',
    englishName: 'address',
    error: {
      required: 'Vui lòng nhập địa chỉ hợp lệ.',
    },
  },

  {
    name: 'Mô tả về tài sản',
    englishName: 'decription',
    isTextArea: true,
    error: {
      required: 'Vui lòng nhập mô tả hợp lệ.',
    },
  },
  //Home for Rent/Sale
  //    //option
  //    squareFeet: true,
  //    dateAvailable: true,
  //    laundryType: true,
  //    parkingType: true,
  //    airConditioningType: true,
  //    heatingType: true,
  //    catFriendly: true,
  //    dogFriendly: true,
  //  },
];

export const fieldByHomeFor = [
  // {
  //   _id: 'Sell',
  //   name: 'Bán nhà',
  //   //must
  //   price: true,
  //   //option
  // },
  // {
  //   _id: 'Rent',
  //   name: 'Cho thuê',
  //   //must
  //   pricePerMonth: true,
  //   //option
  // },
];

export const radiusArr = [
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 5,
  },
  {
    value: 10,
  },
  {
    value: 20,
  },
  {
    value: 40,
  },
  {
    value: 60,
  },
  {
    value: 1000,
  },
];
