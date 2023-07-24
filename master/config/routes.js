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
    name: '微前端-路由显示',
    icon: 'user',
    path: '/slave/*',
    microApp: 'slave',
  },
  {
    name: '微前端-内部Mi',
    icon: 'user',
    path: '/slave2',
    component: './Mirco',
  },
  {
    name: '微前端-MemoHistory',
    icon: 'user',
    path: '/slave3',
    component: './Mirco/index2',
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
