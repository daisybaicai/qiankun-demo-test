import React from 'react';
import { Button, Divider, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { MicroAppWithMemoHistory } from '@umijs/max';
// import CustomErrorBoundary from "@/components/CustomErrorBoundary";
import styles from './index.less';

const defaultParams = {
//   settings: {
//     sandbox: {
//       experimentalStyleIsolation: true,
//     },
//   },
};


export default function Theme() {
  return (
    <PageContainer ghost title={'基于sandbox: {experimentalStyleIsolation: true}样式隔离'}>
      <Divider />

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
      <Divider />
      <h3>微应用(sub-app-1)</h3>
      <MicroAppWithMemoHistory name="slave" url="/" base="/" />
      <Divider />
    </PageContainer>
  );
}
