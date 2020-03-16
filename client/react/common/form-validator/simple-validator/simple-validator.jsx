import omit from "lodash/omit"

export const simpleValidator = (schema) => {
  let wrongs = {};
  return () => {
    console.log(wrongs)
    const validateField = (key, value) =>  {
      if (schema.hasOwnProperty(key)) {
        let validators = schema[key].arr;
        for (let vld of validators) {
          let res = vld(value);
          console.log(res);
          if (!res.result) {
            wrongs = Object.assign(wrongs, {[key]: res.msg(schema[key].label)});
            return;
          }
        }
        wrongs = omit(wrongs, key)
      }

    };
    return {
      validateComp(render, key) {

        return render({
            res: wrongs[key], validateField: (value, callback) => {
              validateField(key, value);
              callback(value);
            }
          }
        )
      },
      getInvalids() {
        return Object.keys(wrongs);
      }
    }
  }

};
