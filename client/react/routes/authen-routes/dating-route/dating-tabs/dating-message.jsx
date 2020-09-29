import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { userInfo } from "../../../../../common/states/common";
export class DatingMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          _id: uuidv4(),
          from_person: {
            name: "Minh Thu",
            avatar:
              "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/117767151_2829892620445685_156533284534524570_o.jpg?_nc_cat=108&_nc_sid=8bfeb9&_nc_ohc=voMqIMbQZLkAX9jreoc&_nc_ht=scontent.fhan2-3.fna&oh=1b3a87b15b8228decb349312ae01be56&oe=5F81307C",
          },
          message: {
            from_person: {
              name: "Minh Thu",
              avatar:
                "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/117767151_2829892620445685_156533284534524570_o.jpg?_nc_cat=108&_nc_sid=8bfeb9&_nc_ohc=voMqIMbQZLkAX9jreoc&_nc_ht=scontent.fhan2-3.fna&oh=1b3a87b15b8228decb349312ae01be56&oe=5F81307C",
            },
            content: "I love tuan anh",
          },
        },
        {
          _id: uuidv4(),
          from_person: {
            name: "Minh Thu",
            avatar:
              "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/117767151_2829892620445685_156533284534524570_o.jpg?_nc_cat=108&_nc_sid=8bfeb9&_nc_ohc=voMqIMbQZLkAX9jreoc&_nc_ht=scontent.fhan2-3.fna&oh=1b3a87b15b8228decb349312ae01be56&oe=5F81307C",
          },
          message: {
            from_person: {
              _id: userInfo.getState()._id,
              name: "Minh Thu",
              avatar:
                "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.0-9/117767151_2829892620445685_156533284534524570_o.jpg?_nc_cat=108&_nc_sid=8bfeb9&_nc_ohc=voMqIMbQZLkAX9jreoc&_nc_ht=scontent.fhan2-3.fna&oh=1b3a87b15b8228decb349312ae01be56&oe=5F81307C",
            },
            content: "I love tuan anh",
          },
        },
      ],
    };
  }
  render() {
    const { messages } = this.state;
    return (
      <div className='dating-message'>
        {messages.map((each, i) => (
          <div className='dating-chat-box' key={i}>
            <div className='dating-chat-avatar'>
              <div className='avatar-wrapper'>
                <img src={each.from_person.avatar} />
              </div>
            </div>
            <div className='dating-wapper-content'>
              <div className='dating-chat-name'>{each.from_person.name}</div>
              <div className='dating-last-message'>
                {each.message.from_person._id === userInfo.getState()._id ? (
                  <span className='highlight dark'>Bạn : </span>
                ) : (
                  `${each.message.from_person.name} :  `
                )}
                {each.message.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
