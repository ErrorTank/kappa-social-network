

const feedPageCategory = (PageCategory) => {
    const allCategories = [
        {
            name: "Ngân hàng",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Quán bar",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Hiệu sách",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Địa điểm sự kiện",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Chợ hàng hóa",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Khách sạn",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Doanh nghiệp địa phương",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Rạp chiếu phim",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Bảo tàng/Triển lãm",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Nhà hàng/Cafe",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Trường học",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Siêu thị/Cửa hàng bán lẻ",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Spa/Làm đẹp",
            required_pre_fill: true,
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Dịch vụ sửa chữa",
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Nhà thờ",
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Công ty",
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Máy tính/Điện tử",
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Dịch vụ tư vấn",
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Kinh doanh thực phẩm",
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Chăm sóc sức khỏe",
            page_has_location: true,
        }, {
            name: "Công ty bảo hiểm",
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Công ty Phần mềm",
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Dịch vụ Internet",
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Công ty luật",
            page_has_location: true,
            page_has_open_time: true
        }, {
            name: "Tổ chức phi lợi nhuận",
            page_has_location: true,
        }, {
            name: "Dịch vụ truyền thông",
            page_has_location: true,
        }, {
            name: "Dịch vụ du lịch",
            page_has_location: true,
        }, {
            name: "Ứng dụng/Phần mềm",
            page_has_location: true,
            page_has_sell_items: true
        }, {
            name: "Đồ gia dụng",
            page_has_location: true,
            page_has_sell_items: true,
        }, {
            name: "Đồ dùng trẻ em",
            page_has_location: true,
            page_has_sell_items: true,
        }, {
            name: "Dịch vụ ô tô",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Dịch vụ xe máy",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Quần áo/Thời trang",
            page_has_location: true,
            page_has_sell_items: true,
        }, {
            name: "Điện tử",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Thực phẩm",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Trò chơi",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Đồ chơi",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Trang sức",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Đồng hồ",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Đồ dùng trong nhà",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Đồ dùng thú cưng",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Thuốc/Thực phẩm chức năng",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Cửa hàng ô tô",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Cừa hàng xe máy",
            page_has_location: true,
            page_has_sell_items: true,
        },{
            name: "Đạo diễn",
        },{
            name: "Diễn viên",

        },{
            name: "Vận động viên",
        },{
            name: "Họa sĩ",
        },{
            name: "Tác giả",

        },{
            name: "Doanh nhân",

        },{
            name: "Đầu bếp",

        },{
            name: "Huấn luyện viên",

        },{
            name: "Bác sĩ",

        },{
            name: "Nhà báo",

        },{
            name: "Luật sư",

        },{
            name: "Diễn viên",

        },{
            name: "Nhạc sĩ",
        },{
            name: "Ban nhạc",
        },{
            name: "Chính trị gia",
        },{
            name: "Giáo viên",
        },{
            name: "Album",
            page_has_sell_items: true,
        },{
            name: "Sách/Báo",
            page_has_sell_items: true,
        },{
            name: "Nhạc sĩ",
            page_has_sell_items: true,
        },{
            name: "Thư viện",
            page_has_location: true,
            page_has_open_time: true
        },{
            name: "Tạp chí",
        },{
            name: "Phim",
        },{
            name: "Đài radio",
            page_has_location: true,
            page_has_open_time: true
        },{
            name: "Sân vận động",
            page_has_location: true,
            page_has_open_time: true
        },{
            name: "Nhà thi đấu",
            page_has_location: true,
            page_has_open_time: true
        },{
            name: "Kênh truyền hình",
            page_has_open_time: true
        },{
            name: "Chương trình truyền hình",
            page_has_open_time: true
        },
    ];
    return PageCategory.insertMany(allCategories)
};


const feedMapping = (Mapping) => {
    new Mapping({

    }).save().then(() => console.log("cac"))
}


module.exports = ({PageCategory, District, Ward, City, Mapping}) => {
    return Promise.all([
        // feedPageCategory(PageCategory),
        // feedDistrict(District),
        // feedWard(Ward),
        // feedCity(City),
        // feedMapping(Mapping)
    ])
};