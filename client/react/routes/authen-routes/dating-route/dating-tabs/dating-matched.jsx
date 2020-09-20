import React, { Component } from "react";

export class DatingMatched extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peoples: [
        {
          imgUrl:
            "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/117767151_2829892620445685_156533284534524570_o.jpg?_nc_cat=108&_nc_sid=8bfeb9&_nc_ohc=voMqIMbQZLkAX9jreoc&_nc_ht=scontent.fhan2-3.fna&oh=1b3a87b15b8228decb349312ae01be56&oe=5F81307C",
          name: "MinhThu",
        },
        {
          imgUrl:
            "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/117767151_2829892620445685_156533284534524570_o.jpg?_nc_cat=108&_nc_sid=8bfeb9&_nc_ohc=voMqIMbQZLkAX9jreoc&_nc_ht=scontent.fhan2-3.fna&oh=1b3a87b15b8228decb349312ae01be56&oe=5F81307C",
          name: "MinhThu",
        },
        {
          imgUrl:
            "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/117767151_2829892620445685_156533284534524570_o.jpg?_nc_cat=108&_nc_sid=8bfeb9&_nc_ohc=voMqIMbQZLkAX9jreoc&_nc_ht=scontent.fhan2-3.fna&oh=1b3a87b15b8228decb349312ae01be56&oe=5F81307C",
          name: "MinhThu",
        },
        {
          imgUrl:
            "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/117767151_2829892620445685_156533284534524570_o.jpg?_nc_cat=108&_nc_sid=8bfeb9&_nc_ohc=voMqIMbQZLkAX9jreoc&_nc_ht=scontent.fhan2-3.fna&oh=1b3a87b15b8228decb349312ae01be56&oe=5F81307C",
          name: "MinhThu",
        },
      ],
    };
  }
  render() {
    const { peoples } = this.state;
    return (
      <div className="dating-matched">
        {peoples.map((people) => (
          <div className="img-matched">
            <img src={people.imgUrl} />
            <div className="username">{people.name}</div>
          </div>
        ))}
      </div>
    );
  }
}
