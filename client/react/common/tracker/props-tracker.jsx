import React from "react";

export const PropsTracker = ({getProp, initial = null}) => {
  let prevProp = initial;
  return {
    Tracker:  class extends React.Component{
      constructor(props) {
        super(props);
        prevProp = getProp(prevProp, props);
        console.log(prevProp)
      };

      static setProps(initProps){
        prevProp = initProps;
      }

      componentWillReceiveProps(nextProps) {

        prevProp = getProp(prevProp, nextProps);
      }

      render() {

        return this.props.render(prevProp)
      }
    },
    Getter:() => prevProp
  }
};
