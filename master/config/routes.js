export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        component: './User/Login',
      },
      {
        path: '/user/register',
        component: './User/Register',
      },
    ],
  },
  {
    path: '/templates',
    name: '应用模板',
    icon: 'shop',
    key: 'templates',
    access: 'normalRouteFilter',
    routes: [
      {
        path: '/templates',
        redirect: '/templates/list',
      },
      {
        path: '/templates/list',
        name: '列表应用',
        component: './Templates/List',
        key: 'list',
        access: 'normalRouteFilter',
      },
      // {
      //   path: '/templates/pro-list',
      //   name: 'Pro列表',
      //   component: './Templates/ProList',
      //   key: 'pro-list',
      //   // access: 'normalRouteFilter',
      // },
      {
        path: '/templates/step-form',
        name: '分步表单',
        component: './Templates/StepForm',
        key: 'StepForm',
        // access: 'normalRouteFilter',
      },
      {
        path: '/templates/detail/:id',
        name: '列表详情',
        component: './Templates/Detail',
        hideInMenu: true,
        operateForm: false,
        parentKeys: ['/templates/list'],
      },
      {
        path: '/templates/form/:id',
        name: '列表详情(编辑)',
        component: './Templates/Detail',
        hideInMenu: true,
        operateForm: true,
        parentKeys: ['/templates/list'],
      },
      {
        path: '/templates/form-demo',
        name: '表单应用',
        component: './Templates/Form',
        key: 'form',
        access: 'normalRouteFilter',
      },
      {
        path: '/templates/chart-demo',
        name: '图表应用',
        component: './Templates/Chart',
        key: 'chart',
      },
      // {
      //   path: '/templates/tree-demo',
      //   name: '树级线性结构列表',
      //   component: './Templates/TreeList',
      //   key: 'tree',
      // },
      {
        path: '*',
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/profile',
  },
  {
    path: '/profile',
    component: './User/Profile',
  },
  {
    path: '/reset-pwd',
    component: './User/UpdatePwd',
    menuRender: false,
  },
  {
    path: '/account',
    name: '用户管理',
    icon: 'user',
    component: './Account',
    key: 'account',
    access: 'normalRouteFilter',
  },
  {
    path: '*',
    component: './404',
  },
];
