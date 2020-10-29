// import isNil from "lodash/isNil"
import { categoryApi } from './../../api/common/category-api';
import { itemField } from './../../const/listing';

const checkNumber = (value) => {
  const re = /^[0-9\b]+$/;
  return re.test(value);
};

const cleanBlankProp = (obj) => {
  return Object.keys(obj).reduce(
    (total, propName) =>
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ''
        ? { ...total }
        : { ...total, [propName]: obj[propName] },
    {}
  );
};

const moneyToNumber = (value) => {
  if (!value.includes('₫') && value.length > 1) {
    value = value.slice(0, value.length - 2);
    return value.split('.').join('');
  } else {
    value = value.replace(' ₫', '');
    return value.split('.').join('');
  }
};

const numberToMoney = (value) => {
  let money = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${money} ₫`;
};

const getCategoriesNavigation = (categories) => {
  let otherCategory = [
    { icon: 'fas fa-home', name: 'Bán nhà' },
    {
      icon: 'far fa-home-alt',
      name: 'Cho thuê',
    },
  ];

  let itemInfo = itemField.find((e) => e.englishName === 'category');
  let itemIcon = itemInfo.options.filter((e) => e.icon);
  let additionInfo = [...itemIcon, ...otherCategory];

  let categoryWithIcon = categories.reduce((res, option) => {
    let checkIcon = additionInfo.find((each) => each.name === option.name);

    if (checkIcon) {
      let fullOption;
      if (!!option.children.length) {
        fullOption = {
          ...option,
          children: option.children.map((e) => {
            return {
              ...e,
              link: `/marketplace/${e._id}`,
            };
          }),
        };
      } else {
        fullOption = option;
      }
      return [
        ...res,
        {
          ...fullOption,
          icon: checkIcon.icon,
          link: `/marketplace/${option._id}`,
        },
      ];
    } else {
      return res;
    }
  }, []);

  return categoryWithIcon;
};

export {
  checkNumber,
  cleanBlankProp,
  moneyToNumber,
  numberToMoney,
  getCategoriesNavigation,
};
