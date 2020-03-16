import React from "react";
import get from "lodash/get";
import update from "lodash/update";
import {createEventEmiter, keyEvents} from "../../../common/events/events";

require("./yup-configs");

export const createSimpleForm = (schema, _options) => {
  const defaultOptions = {
    validateOnBlur: true,
    validateOnChange: false,
    initData: {},
  };

  let options = Object.assign({}, defaultOptions, _options);

  let state = {...options.initData};
  let errors = {};
  let touched = {};
  let eventManagement = createEventEmiter();

  const getPathData = (path) => {
    return get(state, path);
  }

  const updatePathData = (path, data) => {
    update(state, path, () => data);
  };

  const validateData = async () => {
    try {
      await schema.validate({...state}, {abortEarly: false});
      errors = {};
    } catch (e) {
      errors = {};

      if (e.inner && e.inner.length > 0) {
        e.inner.forEach(error => {
          errors[error.path] = error;
        })
      } else {
        errors[e.path] = e;
      }
    }
  };

  const validatePath = async (path) => {
    try {
      await schema.validateAt(path, state);
      delete errors[path];
    } catch (_e) {
      errors[path] = _e;
    }
  };

  const onEnter = path => (e) => {
    if (keyEvents.isEnter(e)) {
      eventManagement.emit("enter");
    }
  };


  const onChange = (path, validateOnChange, relativeFields) => async (e) => {
    const value = e.target && e.type == "change" ? e.target.value : e;

    updatePathData(path, value);

    eventManagement.emit("change", state);

    if (validateOnChange || options.validateOnChange) {
      if (!touched[path]) {
        touched[path] = true;
      }
      if(relativeFields && relativeFields.length){

        for(let p of relativeFields){
          if(!touched[p]){
            touched[p] = true;
          }
          await validatePath(p)
        }

      }
      if (options && options.validateAll) {
        await validateData()
      } else{
        await validatePath(path);
      }


      eventManagement.emit("change", state);
    }
  };

  const onBlur = (path) => async e => {
    if (!touched[path]) {
      touched[path] = true;
    }
    try {
      await schema.validateAt(path, state);
      delete errors[path];
    } catch (_e) {
      errors[path] = _e;
    }
    eventManagement.emit("change", state);
  };

  // validateData();

  return {
    setSchema: (newSchema = {}) => {
      schema = newSchema;
    },
    on: eventManagement.on,
    validateData: async () => {
      await validateData();
      eventManagement.emit("change", state, {validate: true});
    },
    getInvalidPaths: () => Object.keys(errors),
    getErrorPath: (path) => {
      return touched[path] ? {...errors[path]} : null
    },
    getData: () => ({...state}),
    updatePathData: async (path, data) => {
      // console.log(errors)
      updatePathData(path, data);
      await validatePath(path);
      eventManagement.emit("change", state);
    },
    resetData: async (data = {}) => {
      state = Object.assign({}, data, options.initData);

      await validateData();
      touched = {};
      eventManagement.emit("change", state);
    },
    setInitData: (data = {}) => {
      options = Object.assign({}, options, {initData: data})
    },
    updateData: async (data) => {
      state = Object.assign({}, state, data);
      await validateData();
      eventManagement.emit("change", state);
    },
    isValid: () => Object.keys(errors).length == 0,
    getPathData,
    enhanceInput: (path, validateOnChange = false) => {
      return {
        value: getPathData(path),
        onChange: onChange(path, validateOnChange),
        onBlur: onBlur(path),
      }
    },
    enhanceComponent: (path, component, validateOnChange = false, relativeFields = []) => {
      return component({
        value: getPathData(path),
        onChange: onChange(path, validateOnChange, relativeFields),
        onBlur: onBlur(path),
        error: touched[path] ? errors[path] : null,
        onEnter: onEnter(path),
      })
    }
  }
};
