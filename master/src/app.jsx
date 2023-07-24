import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import * as Icon from '@ant-design/icons';
import { history, Link } from '@umijs/max';
import { stringify } from 'qs';
import RightContent from '@/components/RightContent';
import { defaultKeys } from '@/utils/menu';
import { formatPath } from '@/utils/utils';
import Logo from '@/assets/logo-title.svg';
import { fetchProfile } from '@/services/api';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const registerPath = '/user/register';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const msg = await fetchProfile({
        skipErrorHandler: true, // 跳过默认的错误处理
      });
      const info = msg.data;
      info.hasRoutesKeys = info?.menuData || defaultKeys;
      return info;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  const { pathname } = window.location;

  // 如果不是登录和注册页面，执行
  if (formatPath(pathname) !== loginPath && formatPath(pathname) !== registerPath) {
    const currentUser = await fetchUserInfo();

    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

const handleTargetJump = (path, target) => {
  window.open(path, target);
};

const IconFont =
  ICON_FONT_URL &&
  Icon.createFromIconfontCN({
    scriptUrl: ICON_FONT_URL,
  });

function getIcon(iconName) {
  if (!Icon[iconName]) {
    return null;
  }
  return React.createElement(Icon[iconName]);
}
const SubMenuIcon = React.memo(({ showIcon, icon, className = 'submenu-icon' }) => {
  if (!showIcon || !icon) {
    return null;
  }
  if (typeof icon === 'string') {
    if (icon.indexOf('icon-') > -1) {
      return <IconFont type={icon} />;
    }
    return <span className={className}>{getIcon(icon)}</span>;
  }
  return <span className={className}>{icon}</span>;
});

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout = ({
  initialState,
  // setInitialState
}) => {
  const menuDataRender = (menuData, isParent = true) =>
    menuData.map((item) => {
      let localItem = {
        ...item,
        children: item.children ? menuDataRender(item.children, false) : undefined,
      };
      if (item.group && isParent) {
        localItem = {
          key: item.group,
          name: item.group,
          type: 'group',
          children: [localItem],
        };
      }
      return localItem;
    });
  return {
    logo: <img src={Logo} alt="logo" />,
    title: '',
    /**
     * 使用 Token 快速的修改组件库的基础样式
     * @doc https://procomponents.ant.design/components/layout/#token
     */
    token: {
      bgLayout: '#f0f2f5', // layout 的背景颜色
      sider: {
        colorMenuBackground: '#fff', // menu 的背景颜色
        colorBgMenuItemSelected: '#F6F6F6', // 选中背景色
      },
      header: {
        colorBgHeader: defaultSettings.colorPrimary, // header 的背景颜色
        heightLayoutHeader: 64, // header 高度
      },
    },
    rightContentRender: () => <RightContent />,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    layoutBgImgList: [],
    links: [],
    menuDataRender,
    menuHeaderRender: undefined,
    menuItemRender: (menuItemProps, defaultDom) => {
      if (menuItemProps.targetUrl) {
        return (
          <a onClick={() => handleTargetJump(menuItemProps.targetUrl, menuItemProps.target)}>
            {defaultDom}
          </a>
        );
      }
      if (menuItemProps.isUrl || !menuItemProps.path) {
        return defaultDom;
      }
      // 支持二级菜单显示icon
      return (
        <Link to={menuItemProps.path}>
          <SubMenuIcon showIcon={menuItemProps.showIcon} icon={menuItemProps.icon} />
          {defaultDom}
        </Link>
      );
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <ConfigProvider
          input={{ autoComplete: 'off', placeholder: '请输入' }}
          select={{ allowclear: true, placeholder: '请选择' }}
          locale={zhCN}
          {...props}
        >
          {children}
        </ConfigProvider>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
  paramsSerializer: (params) => stringify(params, { indices: false }),
  // timeout: 3000,
};

// src/app.ts
export const qiankun = {
  apps: [
    {
      name: 'slave',
      entry: '//localhost:5555',
    },
  ],
};