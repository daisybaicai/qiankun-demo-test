// 表单数据类型
export const FORM_ITEM_TYPE = {
  TEXT: {
    code: 'TEXT',
    desc: '文本输入框',
    icon: 'icon-trace-text',
  },
  TEXT_AREA: {
    code: 'TEXT_AREA',
    desc: '文本框',
    icon: 'icon-trace-text',
  },
  DATE_RANGE: {
    code: 'DATE_RANGE',
    desc: '日期区间',
    icon: 'icon-trace-time',
  },
  SELECT: {
    code: 'SELECT',
    desc: '下拉框',
    icon: 'icon-trace-photo',
  },
  DATE: {
    code: 'DATE',
    desc: '日期',
    icon: 'icon-trace-time',
  },
  RADIO: {
    code: 'RADIO',
    desc: '单选框',
    icon: 'icon-trace-photo',
  },
};

// 列表表单布局
export const LIST_FORM_LAYOUT = {
  xs: 24,
  sm: 12,
  xl: 6,
};

// 加密配置
export const CRYPTO_CONFIG = {
  jsKey: 'jsKey',
  iv: 'iv',
  salt: 'salt',
};

// 普通固定的下载previewUrl
export const FILE_PREVIEW_URL = '/api/v1/file/preview';

// 操作类型枚举
export const OPERATE_TYPE = {
  CLOSE: {
    code: 'CLOSE',
    desc: '关闭',
  },
  EDIT: {
    code: 'EDIT',
    desc: '编辑',
  },
  CREATE: {
    code: 'CREATE',
    desc: '创建',
  },
  VIEW: {
    code: 'VIEW',
    desc: '查看',
  },
};

// 用户类型
export const USER_TYPE_MAP = {
  ADMIN: {
    code: 'ADMIN',
    desc: '管理员',
  },
  USER: {
    code: 'USER',
    desc: '用户',
  },
};

// 账户状态枚举
export const ACCOUNT_STATUS_MAP = {
  true: {
    code: true,
    desc: '启用中',
    color: '#6BC251',
  },
  false: {
    code: false,
    desc: '禁用中',
    color: '#DE3535',
  },
};

// 页面操作类型枚举
export const ACTION_TYPE = {
  ADD: {
    code: 'ADD',
    desc: '新增',
  },
  UPDATE: {
    code: 'UPDATE',
    desc: '修改',
  },
  DELETE: {
    code: 'DELETE',
    desc: '删除',
  },
  VIEW: {
    code: 'VIEW',
    desc: '查看',
  },
  REVIEW: {
    code: 'REVIEW',
    desc: '审查',
  },
};
