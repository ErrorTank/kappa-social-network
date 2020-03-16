import * as yup from "yup";
import isEmpty from "lodash/isEmpty";

yup.addMethod(yup.string, "isTax", function (message) {
  return this.test("isTax", message, function (val) {
    return val ? (val.length === 14 || val.length === 10) : true
  })
});

yup.addMethod(yup.string, "notHaveNumber", function (message) {
  return this.test("notHaveNumber", message, function (val) {
    return /\d/gi.test(val) === false
  })
});

yup.addMethod(yup.object, "notEmpty", function (message = "no data") {
  return this.test("notEmpty", message, function (val) {
    return !isEmpty(val)
  })
});
yup.addMethod(yup.string, "isPhone", function (message = "no data") {
  return this.test("isPhone", message, function (val) {
    return /\D/gi.test(val) === false
  })
});
yup.addMethod(yup.string, "onlyWord", function (message) {
  return this.test("onlyWord", message, function (val) {
    return /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$/gi.test(val.replace(/\s/gi, "")) === true
  })
});
yup.addMethod(yup.string, "noSpecialChar", function (message) {
  return this.test("onlyWord", message, function (val) {
    return /\W/gi.test(val.replace(/\s/gi, "")) === false
  })
});

yup.addMethod(yup.string, "haveChar", function (message) {
  return this.test("haveChar", message, function (val) {
    return /[a-z]/gi.test(val) === true
  })
});

yup.addMethod(yup.string, "haveNumber", function (message) {
  return this.test("haveNumber", message, function (val) {
    return /\d/gi.test(val) === true
  })
});

yup.addMethod(yup.string, "equalTo", function (ref, message) {
  return this.test({
    name: "equalTo",
    exclusive: false,
    message,
    params: {
      reference: ref.path
    },
    test: function (val) {
      return val === this.resolve(ref);
    }
  })
});

yup.addMethod(yup.string, "notEqualTo", function (ref, message) {
  return this.test({
    name: "notEqualTo",
    exclusive: false,
    message,
    params: {
      reference: ref.path
    },
    test: function (val) {
      return val !== this.resolve(ref);
    }
  })
});

yup.addMethod(yup.date, "notReach", function (message) {

  return this.test({
    name: "notReach",
    exclusive: false,
    message,
    // params: {
    //   reference: ref.path
    // },
    test: function (val) {
      const item = this.parent;
      // const index = parseInt(this.path.split("[")[1].split("]")[0], 10);
      // console.log(index)
      // console.log(this.resolve(this.path))
      // console.log(this.path)
      // this.resolve(ref)
      // console.log(item)
      let valTime = new Date(val).getTime();
      let refTime = new Date(item.to).getTime();
      // console.log(refTime - valTime)
      return refTime - valTime > 0;
    }
  })
});