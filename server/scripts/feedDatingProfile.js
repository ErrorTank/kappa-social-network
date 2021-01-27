const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const dbManager = require('../config/db');
const appDb = dbManager.getConnections()[0];
const Profile = require('../db/model/dating/profile')(appDb);

let profile = [
  // {
  //   _id: new ObjectId(),
  //   bio: "hi....",
  //   name: "Minh Thu",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/MinhThu/minhthu1.jpg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/MinhThu/minhthu2.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/MinhThu/minhthu3.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/MinhThu/minhthu4.jpg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1998, 6, 7),
  //   location: {
  //     lat: 21.079319,
  //     lng: 105.802287,
  //     ward: ObjectId("5e92c7b6b4c8182784f5b9f6"),
  //     district: ObjectId("5e92c7b4b4c8182784f59943"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "CHATTING",
  //   height: 158,
  //   hometown: {
  //     ward: ObjectId("5e92c7b6b4c8182784f5b9f6"),
  //     district: ObjectId("5e92c7b4b4c8182784f59943"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   job: "Student",
  //   secondarySchool: "THPT Nhân Chính",
  //   university: "Học viện tài chính",
  //   educationLevel: "BACHELORS DEGREE",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "NEVER",
  //   drinking: "OCCASIONALLY",
  //   religion: "PREFER NOT TO SAY",
  //   popularity: 20,
  //   filterSetting: {
  //     distance: 30,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 18, toNumber: 30 },
  //     heightRange: { fromNumber: 149, toNumber: 180 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
<<<<<<< HEAD

=======
>>>>>>> c0405432647baf99f2213d3fc68c7b7fcbc1cb6c
  // {
  //   _id: new ObjectId(),
  //   bio: "người ta thay bồ như thay áo, còn tôi quyết định không mặc gì",
  //   name: "Linh Đàm",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/LinhDam/linhdam1.jpg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/LinhDam/linhdam2.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/LinhDam/linhdam3.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/LinhDam/linhdam4.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/LinhDam/linhdam5.jpg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1998, 5, 7),
  //   location: {
  //     lat: 20.99512,
  //     lng: 105.867786,
  //     ward: ObjectId("5e92c7b4b4c8182784f59941"),
  //     district: ObjectId("5e92c7b4b4c8182784f59941"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "FRIENDSHIP",
  //   height: 160,
  //   hometown: {
  //     ward: ObjectId("5e92c7b4b4c8182784f59941"),
  //     district: ObjectId("5e92c7b4b4c8182784f59941"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   job: "Streamer",
  //   educationLevel: "PREFER NOT TO SAY",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "OCCASIONALLY",
  //   drinking: "OCCASIONALLY",
  //   religion: "PREFER NOT TO SAY",
  //   popularity: 25,
  //   filterSetting: {
  //     distance: 6,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 25, toNumber: 35 },
  //     heightRange: { fromNumber: 149, toNumber: 190 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
<<<<<<< HEAD

=======
>>>>>>> c0405432647baf99f2213d3fc68c7b7fcbc1cb6c
  // {
  //   _id: new ObjectId(),
  //   bio: "Match để biết thêm chi tiết",
  //   name: "Lê Ngọc",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/LeNgoc/lengoc1.jpg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/LeNgoc/lengoc2.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/LeNgoc/lengoc3.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/LeNgoc/lengoc4.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/LeNgoc/lengoc5.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/LeNgoc/lengoc6.jpg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1997, 9, 19),
  //   location: {
  //     lat: 21.016634,
  //     lng: 105.784368,
  //     ward: ObjectId("5e92c7b6b4c8182784f5ba4f"),
  //     district: ObjectId("5e92c7b4b4c8182784f59947"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "LONG-TERM RELATIONSHIP",
  //   height: 170,
  //   hometown: {
  //     ward: ObjectId("5e92c7b4b4c8182784f5a12e"),
  //     district: ObjectId("5e92c7b4b4c8182784f59779"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d5e"),
  //   },
  //   job: "Nhân viên ngân hàng",
  //   secondarySchool: "THPT Hậu Lộc 2",
  //   university: "Học viện tài chính",
  //   educationLevel: "BACHELORS DEGREE",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "NEVER",
  //   drinking: "OCCASIONALLY",
  //   religion: "PREFER NOT TO SAY",
  //   popularity: 22,
  //   filterSetting: {
  //     distance: 20,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 24, toNumber: 30 },
  //     heightRange: { fromNumber: 170, toNumber: 200 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
<<<<<<< HEAD

=======
>>>>>>> c0405432647baf99f2213d3fc68c7b7fcbc1cb6c
  // {
  //   _id: new ObjectId(),
  //   bio: "Tìm một mối quan hệ nghiêm túc",
  //   name: "PhAnh",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/PhAnh/phanh1.jpg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/PhAnh/phanh2.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/PhAnh/phanh3.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/PhAnh/phanh4.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/PhAnh/phanh5.jpg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1998, 6, 16),
  //   location: {
  //     lat: 20.976066,
  //     lng: 105.815293,
  //     ward: ObjectId("5e92c7b6b4c8182784f5b9ed"),
  //     district: ObjectId("5e92c7b4b4c8182784f59942"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "LONG-TERM RELATIONSHIP",
  //   height: 158,
  //   hometown: {
  //     ward: ObjectId("5e92c7b6b4c8182784f5baf2"),
  //     district: ObjectId("5e92c7b4b4c8182784f59719"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   secondarySchool: "THPT Vạn Xuân",
  //   university: "Đại học Thăng Long",
  //   educationLevel: "BACHELORS DEGREE",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "NEVER",
  //   drinking: "OCCASIONALLY",
  //   religion: "OTHER",
  //   popularity: 20,
  //   filterSetting: {
  //     distance: 18,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 24, toNumber: 30 },
  //     heightRange: { fromNumber: 160, toNumber: 200 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
<<<<<<< HEAD

=======
>>>>>>> c0405432647baf99f2213d3fc68c7b7fcbc1cb6c
  // {
  //   _id: new ObjectId(),
  //   bio: "Tìm một người bạn nói chuyện những lúc buồn",
  //   name: "Quỳnh Anh",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/QuynhAnh/quynhanh1.jpg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/QuynhAnh/quynhanh2.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/QuynhAnh/quynhanh3.jpg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1996, 1, 12),
  //   location: {
  //     lat: 21.002197,
  //     lng: 105.81475,
  //     ward: ObjectId("5e92c7b6b4c8182784f5b9f7"),
  //     district: ObjectId("5e92c7b4b4c8182784f59943"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "CHATTING",
  //   height: 168,
  //   hometown: {
  //     ward: ObjectId("5e92c7b6b4c8182784f5b9f7"),
  //     district: ObjectId("5e92c7b4b4c8182784f59943"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   job: "Youtuber",
  //   secondarySchool: "THPT Phan Đình Phùng",
  //   university: "Đại học FPT",
  //   educationLevel: "BACHELORS DEGREE",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "NEVER",
  //   drinking: "OCCASIONALLY",
  //   religion: "OTHER",
  //   popularity: 30,
  //   filterSetting: {
  //     distance: 15,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 26, toNumber: 30 },
  //     heightRange: { fromNumber: 170, toNumber: 200 },
  //     educationLevel: "BACHELORS DEGREE",
  //     theirKids: "THEY HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
<<<<<<< HEAD

=======
>>>>>>> c0405432647baf99f2213d3fc68c7b7fcbc1cb6c
  // {
  //   _id: new ObjectId(),
  //   bio: "Đang lạc người anh yêu..",
  //   name: "Thủy Tiên",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/ThuyTien/thuytien1.jpg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/ThuyTien/thuytien2.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/ThuyTien/thuytien3.jpg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1996, 10, 22),
  //   location: {
  //     lat: 21.039108,
  //     lng: 105.769493,
  //     ward: ObjectId("5e92c7b6b4c8182784f5ba6e"),
  //     district: ObjectId("5e92c7b4b4c8182784f59949"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "SOMETHING CASUAL",
  //   height: 163,
  //   hometown: {
  //     ward: ObjectId("5e92c7b6b4c8182784f5ba6e"),
  //     district: ObjectId("5e92c7b4b4c8182784f59949"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   job: "Streamer",
  //   secondarySchool: "Marie Curie HaNoi School",
  //   university: "Học viện ngân hàng",
  //   educationLevel: "BACHELORS DEGREE",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "OCCASIONALLY",
  //   drinking: "OFTEN",
  //   religion: "HINDU",
  //   popularity: 28,
  //   filterSetting: {
  //     distance: 20,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 26, toNumber: 30 },
  //     heightRange: { fromNumber: 170, toNumber: 200 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
<<<<<<< HEAD

=======
>>>>>>> c0405432647baf99f2213d3fc68c7b7fcbc1cb6c
  // {
  //   _id: new ObjectId(),
  //   bio: "Thích thì ib",
  //   name: "Mỹ Hằng",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/MyHang/myhang1.jpg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/MyHang/myhang2.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/MyHang/myhang3.jpg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(2000, 9, 16),
  //   location: {
  //     lat: 16.468258,
  //     lng: 107.576812,
  //     ward: ObjectId("5e92c7b5b4c8182784f5a5ab"),
  //     district: ObjectId("5e92c7b4b4c8182784f597b4"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d63"),
  //   },
  //   gender: "FEMALE",
  //   target: "CHATTING",
  //   height: 164,
  //   hometown: {
  //     ward: ObjectId("5e92c7b5b4c8182784f5aac7"),
  //     district: ObjectId("5e92c7b4b4c8182784f59819"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d6c"),
  //   },
  //   job: "Makeup artist",
  //   secondarySchool: "THPT Duy Tân",
  //   university: "",
  //   educationLevel: "A-LEVELS,HIGHERS OR EQUIVALENT",
  //   yourKids: "I HAVE KIDS",
  //   smoking: "NEVER",
  //   drinking: "OCCASIONALLY",
  //   religion: "OTHER",
  //   popularity: 15,
  //   filterSetting: {
  //     distance: 20,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 22, toNumber: 27 },
  //     heightRange: { fromNumber: 170, toNumber: 190 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "NO PREFERENCE",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
<<<<<<< HEAD

=======
>>>>>>> c0405432647baf99f2213d3fc68c7b7fcbc1cb6c
  // {
  //   _id: new ObjectId(),
  //   bio:
  //     "Gửi tớ một lời chào, rồi tớ sẽ chào lại cậu bằng một lời thân ái. Một chiếc bạn xinh xắn nếu cậu muốn nói chuyện tếu táo để quên đi vài câu chuyện không vui hàng ngày..Indie, đồng âm, tarot, countrystlye, cat,dog....",
  //   name: "Mỹ Anh",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/MyAnh/myanh1.jpg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/MyAnh/myanh2.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/MyAnh/myanh3.jpg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1999, 7, 16),
  //   location: {
  //     lat: 10.773297,
  //     lng: 106.695061,
  //     ward: ObjectId("5e92c7b5b4c8182784f5af68"),
  //     district: ObjectId("5e92c7b4b4c8182784f5987f"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d76"),
  //   },
  //   gender: "FEMALE",
  //   target: "CHATTING",
  //   height: 162,
  //   hometown: {
  //     ward: ObjectId("5e92c7b5b4c8182784f5af68"),
  //     district: ObjectId("5e92c7b4b4c8182784f5987f"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d76"),
  //   },
  //   job: "Student",
  //   secondarySchool: "THPT Hậu Lộc 3",
  //   university: "Đại học Kinh tế quốc dân",
  //   educationLevel: "A-LEVELS,HIGHERS OR EQUIVALENT",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "PREFER NOT TO SAY",
  //   drinking: "OCCASIONALLY",
  //   religion: "OTHER",
  //   popularity: 19,
  //   filterSetting: {
  //     distance: 3,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 22, toNumber: 30 },
  //     heightRange: { fromNumber: 160, toNumber: 190 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
<<<<<<< HEAD

  // {
  //   _id: new ObjectId(),
  //   bio: "Nếu match nghĩa là anh đẹp trai",
  //   name: "Khánh Linh",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/KhanhLinh/khanhlinh1.jpeg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/KhanhLinh/khanhlinh2.jpeg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(2001, 7, 16),
  //   location: {
  //     lat: 21.029866,
  //     lng: 105.850788,
  //     ward: ObjectId("5e92c7b6b4c8182784f5b99a"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993c"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "CHATTING",
  //   height: 175,
  //   hometown: {
  //     ward: ObjectId("5e92c7b6b4c8182784f5b99a"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993c"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   job: "Student",
  //   secondarySchool: "THPT Trung Văn",
  //   university: "Đại học Bách khoa Hà Nội",
  //   educationLevel: "A-LEVELS,HIGHERS OR EQUIVALENT",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "PREFER NOT TO SAY",
  //   drinking: "OCCASIONALLY",
  //   religion: "OTHER",
  //   popularity: 10,
  //   filterSetting: {
  //     distance: 15,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 22, toNumber: 30 },
  //     heightRange: { fromNumber: 160, toNumber: 190 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },

  // {
  //   _id: new ObjectId(),
  //   bio: "Thích thì match, không thích thì match",
  //   name: "Diana Trần",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/DianaTran/dianatran1.jpg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/DianaTran/dianatran2.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/DianaTran/dianatran3.jpg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1995, 2, 20),
  //   location: {
  //     lat: 21.045411,
  //     lng: 105.841521,
  //     ward: ObjectId("5e92c7b6b4c8182784f5b982"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993b"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "SOMETHING CASUAL",
  //   height: 155,
  //   hometown: {
  //     ward: ObjectId("5e92c7b6b4c8182784f5b982"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993b"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   job: "Student",
  //   secondarySchool: "THPT Đại Mỗ",
  //   university: "Đại học Xây dựng",
  //   educationLevel: "A-LEVELS,HIGHERS OR EQUIVALENT",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "PREFER NOT TO SAY",
  //   drinking: "NEVER",
  //   religion: "OTHER",
  //   popularity: 10,
  //   filterSetting: {
  //     distance: 30,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 24, toNumber: 30 },
  //     heightRange: { fromNumber: 170, toNumber: 190 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },

  // {
  //   _id: new ObjectId(),
  //   bio: "Thích thì match, không thích thì match",
  //   name: "Bảo Ngọc ",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/BaoNgoc/baongoc1.jpeg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/BaoNgoc/baongoc2.jpeg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1993, 3, 19),
  //   location: {
  //     lat: 21.039731,
  //     lng: 105.83071,
  //     ward: ObjectId("5e92c7b6b4c8182784f5b982"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993b"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "SOMETHING CASUAL",
  //   height: 155,
  //   hometown: {
  //     ward: ObjectId("5e92c7b6b4c8182784f5b982"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993b"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   job: "Nhân viên văn phòng",
  //   secondarySchool: "THPT FPT",
  //   university: "Đại học Phương Đông",
  //   educationLevel: "A-LEVELS,HIGHERS OR EQUIVALENT",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "PREFER NOT TO SAY",
  //   drinking: "NEVER",
  //   religion: "OTHER",
  //   popularity: 28,
  //   filterSetting: {
  //     distance: 30,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 24, toNumber: 30 },
  //     heightRange: { fromNumber: 170, toNumber: 190 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
  {
    _id: new ObjectId(),
    bio: "Match nói chuyện cho vui nào",
    name: "Trung Hiếu",
    avatars: [
      {
        path: "https://localhost:2000/assets/images/TrungHieu/trunghieu1.jpeg",
        isAvatar: true,
      },
      {
        path: "https://localhost:2000/assets/images/TrungHieu/trunghieu2.jpeg",
        isAvatar: false,
      },
    ],
    birthday: new Date(1996, 11, 19),
    location: {
      lat: 21.054375,
      lng: 105.735134,
      ward: ObjectId("5e92c7b6b4c8182784f5ba6b"),
      district: ObjectId("5e92c7b4b4c8182784f59949"),
      city: ObjectId("5e92c7b4b4c8182784f59d86"),
    },
    gender: "MALE",
    target: "SOMETHING CASUAL",
    height: 175,
    hometown: {
      ward: ObjectId("5e92c7b4b4c8182784f5a105"),
      district: ObjectId("5e92c7b4b4c8182784f59778"),
      city: ObjectId("5e92c7b4b4c8182784f59d5e"),
    },
    job: "Nhân viên văn phòng",
    secondarySchool: "THPT Hậu Lộc 2",
    university: "Đại học Công Nghiệp Hà Nội",
    educationLevel: "A-LEVELS,HIGHERS OR EQUIVALENT",
    yourKids: "I DON'T HAVE KIDS",
    smoking: "PREFER NOT TO SAY",
    drinking: "NEVER",
    religion: "OTHER",
    popularity: 28,
    filterSetting: {
      distance: 30,
      gender: "MALE",
      ageRange: { fromNumber: 24, toNumber: 30 },
      heightRange: { fromNumber: 170, toNumber: 190 },
      educationLevel: "NO PREFERENCE",
      theirKids: "THEY DON'T HAVE KIDS",
      religion: "NO PREFERENCE",
    },
    seen: [],
  },
  {
    _id: new ObjectId(),
    bio: "Match nói chuyện cho vui nào",
    name: "Lee Men Ho",
    avatars: [
      {
        path: "https://localhost:2000/assets/images/leemenho/leemenho.jpeg",
        isAvatar: true,
      },
      {
        path: "https://localhost:2000/assets/images/leemenho/leemenho1.jpeg",
=======
  // {
  //   _id: new ObjectId(),
  //   bio: "Nếu match nghĩa là anh đẹp trai",
  //   name: "Khánh Linh",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/KhanhLinh/khanhlinh1.jpeg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/KhanhLinh/khanhlinh2.jpeg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(2001, 7, 16),
  //   location: {
  //     lat: 21.029866,
  //     lng: 105.850788,
  //     ward: ObjectId("5e92c7b6b4c8182784f5b99a"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993c"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "CHATTING",
  //   height: 175,
  //   hometown: {
  //     ward: ObjectId("5e92c7b6b4c8182784f5b99a"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993c"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   job: "Student",
  //   secondarySchool: "THPT Trung Văn",
  //   university: "Đại học Bách khoa Hà Nội",
  //   educationLevel: "A-LEVELS,HIGHERS OR EQUIVALENT",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "PREFER NOT TO SAY",
  //   drinking: "OCCASIONALLY",
  //   religion: "OTHER",
  //   popularity: 10,
  //   filterSetting: {
  //     distance: 15,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 22, toNumber: 30 },
  //     heightRange: { fromNumber: 160, toNumber: 190 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   bio: "Thích thì match, không thích thì match",
  //   name: "Diana Trần",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/DianaTran/dianatran1.jpg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/DianaTran/dianatran2.jpg",
  //       isAvatar: false,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/DianaTran/dianatran3.jpg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1995, 2, 20),
  //   location: {
  //     lat: 21.045411,
  //     lng: 105.841521,
  //     ward: ObjectId("5e92c7b6b4c8182784f5b982"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993b"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "SOMETHING CASUAL",
  //   height: 155,
  //   hometown: {
  //     ward: ObjectId("5e92c7b6b4c8182784f5b982"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993b"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   job: "Student",
  //   secondarySchool: "THPT Đại Mỗ",
  //   university: "Đại học Xây dựng",
  //   educationLevel: "A-LEVELS,HIGHERS OR EQUIVALENT",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "PREFER NOT TO SAY",
  //   drinking: "NEVER",
  //   religion: "OTHER",
  //   popularity: 10,
  //   filterSetting: {
  //     distance: 30,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 24, toNumber: 30 },
  //     heightRange: { fromNumber: 170, toNumber: 190 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },
  // {
  //   _id: new ObjectId(),
  //   bio: "Thích thì match, không thích thì match",
  //   name: "Bảo Ngọc ",
  //   avatars: [
  //     {
  //       path: "https://localhost:2000/assets/images/BaoNgoc/baongoc1.jpeg",
  //       isAvatar: true,
  //     },
  //     {
  //       path: "https://localhost:2000/assets/images/BaoNgoc/baongoc2.jpeg",
  //       isAvatar: false,
  //     },
  //   ],
  //   birthday: new Date(1993, 3, 19),
  //   location: {
  //     lat: 21.039731,
  //     lng: 105.83071,
  //     ward: ObjectId("5e92c7b6b4c8182784f5b982"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993b"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   gender: "FEMALE",
  //   target: "SOMETHING CASUAL",
  //   height: 155,
  //   hometown: {
  //     ward: ObjectId("5e92c7b6b4c8182784f5b982"),
  //     district: ObjectId("5e92c7b4b4c8182784f5993b"),
  //     city: ObjectId("5e92c7b4b4c8182784f59d86"),
  //   },
  //   job: "Nhân viên văn phòng",
  //   secondarySchool: "THPT FPT",
  //   university: "Đại học Phương Đông",
  //   educationLevel: "A-LEVELS,HIGHERS OR EQUIVALENT",
  //   yourKids: "I DON'T HAVE KIDS",
  //   smoking: "PREFER NOT TO SAY",
  //   drinking: "NEVER",
  //   religion: "OTHER",
  //   popularity: 28,
  //   filterSetting: {
  //     distance: 30,
  //     gender: "MALE",
  //     ageRange: { fromNumber: 24, toNumber: 30 },
  //     heightRange: { fromNumber: 170, toNumber: 190 },
  //     educationLevel: "NO PREFERENCE",
  //     theirKids: "THEY DON'T HAVE KIDS",
  //     religion: "NO PREFERENCE",
  //   },
  //   seen: [],
  // },

  {
    _id: new ObjectId(),
    bio: 'The one',
    name: 'Bảo Tuấn anh ',
    avatars: [
      {
        path: 'https://localhost:2000/assets/images/BaoNgoc/baongoc1.jpeg',
        isAvatar: true,
      },
      {
        path: 'https://localhost:2000/assets/images/BaoNgoc/baongoc2.jpeg',
>>>>>>> c0405432647baf99f2213d3fc68c7b7fcbc1cb6c
        isAvatar: false,
      },
    ],
    birthday: new Date(1990, 11, 19),
    location: {
<<<<<<< HEAD
      lat: 21.002016,
      lng: 105.913155,
      ward: ObjectId("5e92c7b6b4c8182784f5ba43"),
      district: ObjectId("5e92c7b4b4c8182784f59946"),
      city: ObjectId("5e92c7b4b4c8182784f59d86"),
    },
    gender: "MALE",
    target: "SOMETHING CASUAL",
    height: 175,
    hometown: {
      ward: ObjectId("5e92c7b6b4c8182784f5ba43"),
      district: ObjectId("5e92c7b4b4c8182784f59946"),
      city: ObjectId("5e92c7b4b4c8182784f59d86"),
    },
    job: "Diễn viên",
    secondarySchool: "THPT Cổ Bi",
    university: "Học viện nông nghiệp",
    educationLevel: "A-LEVELS,HIGHERS OR EQUIVALENT",
=======
      lat: 21.039731,
      lng: 105.83071,
      ward: ObjectId('5e92c7b6b4c8182784f5b982'),
      district: ObjectId('5e92c7b4b4c8182784f5993b'),
      city: ObjectId('5e92c7b4b4c8182784f59d86'),
    },
    gender: 'FEMALE',
    target: 'SOMETHING CASUAL',
    height: 155,
    hometown: {
      ward: ObjectId('5e92c7b6b4c8182784f5b982'),
      district: ObjectId('5e92c7b4b4c8182784f5993b'),
      city: ObjectId('5e92c7b4b4c8182784f59d86'),
    },
    job: 'Nhân viên văn phòng',
    secondarySchool: 'THPT FPT',
    university: 'Đại học Phương Đông',
    educationLevel: 'A-LEVELS,HIGHERS OR EQUIVALENT',
>>>>>>> c0405432647baf99f2213d3fc68c7b7fcbc1cb6c
    yourKids: "I DON'T HAVE KIDS",
    smoking: 'PREFER NOT TO SAY',
    drinking: 'NEVER',
    religion: 'OTHER',
    popularity: 28,
    filterSetting: {
      distance: 30,
      gender: 'MALE',
      ageRange: { fromNumber: 24, toNumber: 30 },
      heightRange: { fromNumber: 170, toNumber: 190 },
      educationLevel: 'NO PREFERENCE',
      theirKids: "THEY DON'T HAVE KIDS",
      religion: 'NO PREFERENCE',
    },
    seen: [],
  },
];
// Profile.deleteMany({
//   _id: {
//     $nin: [
//       ObjectId("5f537e053f6fc904fc344598"),
//       ObjectId("5f539b47f352b40ebc117fdb"),
//     ],
//   },
// }).then(() => console.log("son is a dog"));
<<<<<<< HEAD
Profile.insertMany(profile).then(() => console.log("tank is a dog"));
=======
Profile.insertMany(profile).then(() => console.log('tank is a dog'));
>>>>>>> c0405432647baf99f2213d3fc68c7b7fcbc1cb6c
