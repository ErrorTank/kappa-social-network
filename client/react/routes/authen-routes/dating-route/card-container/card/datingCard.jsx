import React, { Component } from "react";
import TinderCard from "react-tinder-card";
import { MyTinderCard } from "./myTinderCard/myTinderCard";

export class DatingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peoples: [
        {
          name: "Hoàng Thị Hồng",
          avatars: [
            "https://scontent.fhan2-2.fna.fbcdn.net/v/t1.0-9/62137084_1566929630107377_8715401036371591168_n.jpg?_nc_cat=106&_nc_sid=8bfeb9&_nc_ohc=9GqNZGNhYuoAX9BYYn0&_nc_ht=scontent.fhan2-2.fna&oh=9a6fa8a9a33a9663c9382e1712feeaf1&oe=5F7DFBC9",
          ],
        },
        {
          name: "Minh Thu",
          avatars: [
            "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/117767151_2829892620445685_156533284534524570_o.jpg?_nc_cat=108&_nc_sid=8bfeb9&_nc_ohc=voMqIMbQZLkAX9jreoc&_nc_ht=scontent.fhan2-3.fna&oh=1b3a87b15b8228decb349312ae01be56&oe=5F81307C",
            "https://scontent.fhan3-1.fna.fbcdn.net/v/t1.0-9/118063797_2809767705791510_5063981942313456266_o.jpg?_nc_cat=110&_nc_sid=84a396&_nc_ohc=jgkwSO7wBIMAX-qzH9i&_nc_ht=scontent.fhan3-1.fna&oh=4f04578bc245a1039ee54624b3ec08ed&oe=5F80F128",
          ],
        },
        {
          name: "Phanh",
          avatars: [
            "https://scontent.fhan2-6.fna.fbcdn.net/v/t1.0-9/118386183_1636753273174166_1027460642872502752_o.jpg?_nc_cat=100&_nc_sid=0debeb&_nc_ohc=XqY5OUKf6-YAX8T93Pj&_nc_ht=scontent.fhan2-6.fna&oh=4de7c10ee76915976e31112b734d8952&oe=5F8044C3",
            "https://scontent.fhan3-1.fna.fbcdn.net/v/t1.0-9/118294320_2923260144444854_3005980845727497091_n.jpg?_nc_cat=109&_nc_sid=09cbfe&_nc_ohc=DXB1h64wfYcAX-5LVrd&_nc_oc=AQncaqJR77p32jdi9PJPWQSmKcKvLCA_AnIIDx55_TUUlkREKC-_P1UBQ77o2D7WMm5vJtIX_yj7B5a5Vni9F95I&_nc_ht=scontent.fhan3-1.fna&oh=14d7142865e034a6212be3cb49282b1b&oe=5F83660F",
            "https://scontent.fhan3-3.fna.fbcdn.net/v/t1.0-9/107825375_2796970293740507_2895395087919496269_o.jpg?_nc_cat=101&_nc_sid=8bfeb9&_nc_ohc=VWCW8MUqaiYAX8yiNjW&_nc_ht=scontent.fhan3-3.fna&oh=7e3846c6fa4c232fcf7dde91fdb4af98&oe=5F820CFE",
          ],
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
            <MyTinderCard info={people} />
          </TinderCard>
        ))}
      </div>
    );
  }
}
