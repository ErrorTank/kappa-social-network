import React from "react";
import debounce from "lodash/debounce"
import {CSSTransition} from "react-transition-group";


export class AppNotificationPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      show: false
    };
    props.setSubcriber((content) => {

      this.setState({content, show: true});
      if(props.autoHide){
        this.hidePopup();
      }

    });

  };

  deleteContent = () => {
    this.setState({content: null});
  };

  hidePopup = debounce(() => {
    this.setState({show: false});
  }, this.props.timeout || 0);



  render() {

    return this.props.renderLayout({content: this.state.content, show: this.state.show, deleteContent: () =>  this.deleteContent(), hidePopup: () => this.hidePopup()});
  }
}

export const createNotificationPopup = ({timeout}) => {
  let listeners = [];
  return {
    publish: (keyMap) => {


      listeners.forEach(({func, key}) => {

        if(Object.keys(keyMap).includes(key)){
          func(keyMap[key]);
        }
      })
    },
    installPopup: (key, {autoHide, renderLayout}) => {

      return (
        <AppNotificationPopup
          setSubcriber={(func) => {
            let index = listeners.findIndex(each => each.key === key);
            if(index !== -1){
              listeners.splice(index, 1);
            }
            listeners.push({func, key});
          }}
          renderLayout={renderLayout}
          timeout={timeout}
          autoHide={autoHide}
        />
      )
    }
  };
};

