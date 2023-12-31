import React from "react";
import { Link, useModel } from "umi";
import { Button, Divider, Space } from 'antd';
import styles from './index.less';

export default function HomePage() {
  const masterProps = useModel("@@qiankunStateFromMaster");
  console.log('@@qiankunStateFromMaster', masterProps)
  return (
    <div>
      <Link to="/home2">去首页2</Link>
      <Space>
          <Button type={'primary'}>子应用按钮1</Button>
          <Button>子应用按钮2</Button>
        </Space>


      <h3>主应用(main)</h3>
      <div style={{ background: '#f0f0f0', padding: 24, display: 'flex', flexDirection: 'column' }}>
        <h4>antd-组件库样式</h4>
        <Space>
          <Button type={'primary'}>主应用按钮1</Button>
          <Button>主应用按钮2</Button>
        </Space>
        <Space style={{ marginTop: 16 }} size={24}>
          <div>
            <h4>CSS Modules</h4>
            <a className={styles.link}>我是Link</a>
          </div>
          <div>
            <h4>内联样式</h4>
            <a style={{ color: '#2572E6' }}>我是Link</a>
          </div>
          <div>
            <h4>外联样式</h4>
            <a className={'link'}>我是Link</a>
          </div>
          <div>
            <h4>默认</h4>
            <a>我是Link</a>
          </div>
        </Space>
      </div>
      首页
      <div>{JSON.stringify(masterProps?.globalState)}</div>
    </div>
  );
}
