import React from 'react';
import omit from 'lodash/omit';
import reverse from 'lodash/reverse';

const marketplaceStucture = {
  childrens: [
    {
      url: '/marketplace',
      label: <span className='label'>Marketplace</span>,
      childrens: [
        {
          url: '/marketplace/5f4934c330b2b231185a53a8',
          label: <span className='label'>Xe cộ</span>,
          childrens: [
            {
              url: '/marketplace/112344455778999abbccdeff',
              label: <span className='label'>Xe hơi/Xe tải</span>,
            },

            {
              url: '/marketplace/5f49371859bac41b24d97fd0',
              label: <span className='label'>Xe mô tô thể thao</span>,
            },
            {
              url: '/marketplace/5f49371859bac41b24d97fd1',
              label: <span className='label'>RV/Nhà xe lưu động</span>,
            },
            {
              url: '/marketplace/5f49371859bac41b24d97fd2',
              label: <span className='label'>Thuyền</span>,
            },
            {
              url: '/marketplace/5f49371859bac41b24d97fd3',
              label: <span className='label'>Xe moóc</span>,
            },
            {
              url: '/marketplace/5f49371859bac41b24d97fd4',
              label: <span className='label'>Thương mại/Công nghiệp</span>,
            },
          ],
        },
        {
          url: '/marketplace/5f4934c330b2b231185a53a9',
          label: <span className='label'>Nhà và vườn</span>,
        },
        {
          url: '/marketplace/5f4934c330b2b231185a53af',
          label: <span className='label'>Giải trí</span>,
        },
        // {
        //   url: '/marketplace/5f4934c330b2b231185a53a8',
        //   label: <span className='label'>Xe cộ</span>,
        // },
        // {
        //   url: '/marketplace/5f4934c330b2b231185a53a8',
        //   label: <span className='label'>Xe cộ</span>,
        // },
      ],
    },
  ],
};

let buildingRecursive = (structure, pathname, result) => {
  if (pathname === structure.url) {
    result = [...result, omit(structure, ['childrens'])];
    return result;
  }
  if (structure.childrens) {
    for (const str of structure.childrens) {
      result = buildingRecursive(str, pathname, result);
      if (result.length) {
        if (structure.hasOwnProperty('label')) {
          result = [...result, omit(structure, ['childrens'])];
        }

        return result;
      }
    }
  }
};

export const createBreadcrumbBuilder = (pathname, result = []) => {
  let final = buildingRecursive(marketplaceStucture, pathname, result);
  return reverse(final);
};
