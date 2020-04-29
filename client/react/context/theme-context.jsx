import React from "react";
import {userInfo} from "../../common/states/common";
import {KComponent} from "../common/k-component";


export const ThemeContext = React.createContext();

export class ThemeController extends KComponent{
    constructor(props) {
        super(props);
        this.state = {
            darkMode: userInfo.getState().dark_mode === false
        };
        this.onUnmount(userInfo.onChange((nextState, oldState) => {
            if(nextState?.dark_mode || oldState?.dark_mode){
                this.setState({darkMode: nextState.dark_mode === false});
            }


        }));
    }

    render() {
        return (
            <ThemeContext.Provider value={this.state}>
                {this.props.children(this.state)}
            </ThemeContext.Provider>
        )
    }
}