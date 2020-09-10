import React, { Component } from "react";
import TinderCard from "react-tinder-card";

export class DatingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peoples: [
        {
          name: "Hoàng Thị Hồng",
          url:
            "https://scontent.fhan2-2.fna.fbcdn.net/v/t1.0-9/62137084_1566929630107377_8715401036371591168_n.jpg?_nc_cat=106&_nc_sid=8bfeb9&_nc_ohc=9GqNZGNhYuoAX9BYYn0&_nc_ht=scontent.fhan2-2.fna&oh=9a6fa8a9a33a9663c9382e1712feeaf1&oe=5F7DFBC9",
        },
        {
          name: "Minh Thu",
          url:
            "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/117767151_2829892620445685_156533284534524570_o.jpg?_nc_cat=108&_nc_sid=8bfeb9&_nc_ohc=voMqIMbQZLkAX9jreoc&_nc_ht=scontent.fhan2-3.fna&oh=1b3a87b15b8228decb349312ae01be56&oe=5F81307C",
        },
        {
          name: "Phanh",
          url:
            "https://scontent.fhan2-6.fna.fbcdn.net/v/t1.0-9/118386183_1636753273174166_1027460642872502752_o.jpg?_nc_cat=100&_nc_sid=0debeb&_nc_ohc=XqY5OUKf6-YAX8T93Pj&_nc_ht=scontent.fhan2-6.fna&oh=4de7c10ee76915976e31112b734d8952&oe=5F8044C3",
        },
      ],
    };
  }
  render() {
    let { peoples } = this.state;
    return (
      <div className="dating-card">
        {peoples.map((people) => (
          <TinderCard
            className="swipe"
            key={people.name}
            preventSwipe={["up", "down"]}
          >
            <div
              style={{
                backgroundImage: `url(${people.url})`,
              }}
              className="card"
            >
              <h3>{people.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
    );
  }
}
