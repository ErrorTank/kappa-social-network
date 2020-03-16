

export class Cache {
  engine = null;

  constructor(engine = localStorage) {
    this.engine = engine
  }

  get = (key) => {
    let vStr = this.engine.getItem(key);
    if (vStr == null) {
      return null;
    }
    let ret;
    try{
      ret = JSON.parse(vStr);
    }catch(err){
      console.log(err);
      ret = null;
    }
    return ret;
  };

  set = (value, key, options = {}) => {
    if (value == null) {
      this.engine.removeItem(key);
    } else {
      try {
        this.engine.setItem(key, JSON.stringify(value), options);
      } catch (e) {
        // May throw exception if not enough memory allocated or in Safari's private mode
      }
    }
  };
}




