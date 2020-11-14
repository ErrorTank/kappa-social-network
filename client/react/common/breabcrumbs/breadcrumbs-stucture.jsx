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
              url: '/marketplace/5f49371859bac41b24d97fce',
              label: <span className='label'>Xe hơi/Xe tải</span>,
            },
            {
              url: '/marketplace/5f49371859bac41b24d97fcf',
              label: <span className='label'>Xe máy</span>,
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
          label: <span className='label'>Nhà & vườn</span>,
          childrens: [
            {
              url: '/marketplace/5f49371859bac41b24d97fd5',
              label: <span className='label'>Công cụ </span>,
            },
            {
              url: '/marketplace/5f49371859bac41b24d97fd6',
              label: <span className='label'>Nội thất</span>,
            },
            {
              url: '/marketplace/5f49371859bac41b24d97fd7',
              label: <span className='label'>Hộ gia đình </span>,
            },
            {
              url: '/marketplace/5f49371859bac41b24d97fd8',
              label: <span className='label'>Vườn</span>,
            },
            {
              url: '/marketplace/5f49371859bac41b24d97fd9',
              label: <span className='label'>Thiết bị</span>,
            },
          ],
        },
        {
          url: '/marketplace/5f4934c330b2b231185a53af',
          label: <span className='label'>Giải trí</span>,
          childrens: [
            {
              url: '/marketplace/5f49371859bac41b24d97fda',
              label: <span className='label'>Trò chơi điện tử</span>,
            },
            {
              url: '/marketplace/5f49371859bac41b24d97fdb',
              label: <span className='label'>Sách, phim & nhạc</span>,
            },
          ],
        },
        // don't have children yet
        {
          url: '/marketplace/5f4934c330b2b231185a53aa',
          label: <span className='label'>Quần áo & phụ kiện</span>,
        },
        {
          url: '/marketplace/5f4934c330b2b231185a53ab',
          label: <span className='label'>Đồ điện tử</span>,
        },
        {
          url: '/marketplace/5f4934c330b2b231185a53b1',
          label: <span className='label'>Bán nhà</span>,
        },
        {
          url: '/marketplace/5f4934c330b2b231185a53b2',
          label: <span className='label'>Cho thuê</span>,
        },
        {
          url: '/marketplace/5f4934c330b2b231185a53ac',
          label: <span className='label'>Gia đình</span>,
        },
        {
          url: '/marketplace/5f4934c330b2b231185a53ad',
          label: <span className='label'>Rao vặt</span>,
        },
        {
          url: '/marketplace/5f4934c330b2b231185a53ae',
          label: <span className='label'>Sở thích</span>,
        },
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
    for (let str of structure.childrens) {
      result = buildingRecursive(str, pathname, result);
      if (result.length) {
        if (structure.hasOwnProperty('label')) {
          result = [...result, omit(structure, ['childrens'])];
        }
        return result;
      }
    }
  }
  return result;
};

export const createBreadcrumbBuilder = (pathname, result = []) => {
  let final = buildingRecursive(marketplaceStucture, pathname, result);
  return reverse(final);
};
