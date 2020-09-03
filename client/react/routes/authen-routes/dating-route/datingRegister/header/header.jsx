import React, {Component} from 'react'

class Header extends Component{
    constructor(){
        super()
    }
    render(){
        return(
            <div className="header">
               <h1> Chào mừng Bạn đã sẵn sàng để tìm một nửa kia chưa. Bắt đầu tạo hồ sơ hẹn hò cho mình thôi. </h1>
               <p>Mọi thay đổi của bạn ở đây đều không ảnh hưởng đến nội dung hiển thị trên trang cá nhân của bạn</p>
                
            </div>
        )
    }
}

export default Header