import React, {Fragment} from "react";
import {PropsTracker} from "./tracker/props-tracker";


const PrevLocationTracker = PropsTracker({
  getProp: (prevLocation, nextProps) => {
    if (nextProps.location !== prevLocation) {
      return nextProps.location
    }
    return prevLocation;
  }
});

const TrackLocation = PrevLocationTracker.Tracker;
const GetLocation = PrevLocationTracker.Getter;

export {
  TrackLocation,
  GetLocation
}
