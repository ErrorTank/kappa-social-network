import React, { Component } from "react";

export class DatingLike extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peoples: [
        {
          imgUrl:
            "https://scontent.fhan2-6.fna.fbcdn.net/v/t1.0-9/118386183_1636753273174166_1027460642872502752_o.jpg?_nc_cat=100&_nc_sid=0debeb&_nc_ohc=XqY5OUKf6-YAX8T93Pj&_nc_ht=scontent.fhan2-6.fna&oh=4de7c10ee76915976e31112b734d8952&oe=5F8044C3",
          name: "PhAnh",
        },
      ],
    };
  }
  render() {
    const { peoples } = this.state;
    return (
      <div className='dating-matched'>
        {peoples.map((people, i) => (
          <div className='img-matched' key={i}>
            <img src={people.imgUrl} />
            <div className='username'>{people.name}</div>
          </div>
        ))}
      </div>
    );
  }
}
