/**
 * key必须是唯一的；
 * 若节点非菜单页面，key的格式为 对应页面的key.操作类型，
 * 如用户管理页面（account）的新增按钮的key为 `account.${ACTION_TYPE.ADD.code}`
 */
import { flatten } from '@/utils/utils';
import { ACTION_TYPE } from '@/common/enum';

export const MENU_TREE = [
  {
    key: 'templates',
    title: '应用模板',
    isShow: (props) => true, // TODO 自定义判断方法
    isDisabled: (props) => false, // TODO 自定义判断方法
    children: [
      {
        key: 'list',
        title: '列表应用',
        isShow: (props) => true,
        isDisabled: (props) => false,
      },
      {
        key: 'form',
        title: '表单应用',
        isShow: (props) => true,
        isDisabled: (props) => false,
      },
    ],
  },
  {
    key: 'account',
    title: '用户管理',
    isShow: (props) => true,
    isDisabled: (props) => false,
    children: [
      {
        key: `account.${ACTION_TYPE.ADD.code}`,
        title: '新增',
        isShow: (props) => true,
        isDisabled: (props) => false,
      },
      {
        key: `account.${ACTION_TYPE.UPDATE.code}`,
        title: '修改',
        isShow: (props) => true,
        isDisabled: (props) => false,
      },
      {
        key: `account.${ACTION_TYPE.DELETE.code}`,
        title: '删除',
        isShow: (props) => true,
        isDisabled: (props) => false,
      },
    ],
  },
];

// 默认所有key
export const defaultKeys = flatten(MENU_TREE).map((item) => item.key);

/**
 * 获得menu map映射
 * @returns
 */
export function getMenuMaps() {
  const obj = {};
  MENU_TREE.forEach((item) => {
    if (item.children && Array.isArray(item.children)) {
      obj[`${item.key}`] = { key: item.key, title: item.title };
      item.children.forEach((child) => {
        obj[`${child.key}`] = { key: child.key, title: child.title };
      });
    } else {
      obj[`${item.key}`] = { key: item.key, title: item.title };
    }
  });
  return obj;
}
