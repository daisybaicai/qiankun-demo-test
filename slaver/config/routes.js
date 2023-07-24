export default [
  {
    path: "/",
    component: "../layouts",
    routes: [
      {
        path: "/",
        redirect: "/home",
      },
      {
        path: "/home",
        name: "首页",
        component: "./Home",
      },
      {
        path: "/home2",
        name: "首页2",
        component: "./Home2",
      },
    ],
  },
];
