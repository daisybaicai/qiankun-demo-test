import React, { useRef } from 'react';
import { Card, Button, Descriptions, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import BasePwd from '@/components/BasePwd';
import { useModalParams } from '@/utils/hooks';
import { USER_TYPE_MAP } from '@/common/enum';
import styles from './index.less';

export default function Profile() {
  // eslint-disable-next-line no-unused-vars
  const { initialState, setInitialState } = useModel('@@initialState');

  const { currentUser } = initialState;

  const modalParams = useModalParams();
  const pwdFormRef = useRef();

  const getArea = (val) => {
    let str = val?.cityName ? val?.cityName : '';
    if (val?.countyName) {
      str = `${str}-${val?.countyName}`;
    }
    return str || '-';
  };

  const handleUpdatePwd = () => {
    pwdFormRef.current?.validateFields().then((values) => {
      console.log('value', values);
      const payload = pwdFormRef.current?.formatFieldsValue(values);
      console.log(
        '🚀 ~ file: Profile.jsx:31 ~ pwdFormRef.current?.validateFields ~ payload',
        payload,
      );
    });
  };

  return (
    <PageContainer breadcrumb={null} title="个人中心">
      <Card bordered={false} className={styles.profile}>
        <div className={styles.accountBox}>
          <span className={styles.account}>{currentUser?.accountNo || '-'}</span>
          <span className={styles.name}>{currentUser?.name || '管理员'},您好</span>
        </div>
        <div className={styles.form}>
          <Descriptions
            bordered={false}
            colon={false}
            column={1}
            labelStyle={{ width: 100, color: '#707070' }}
            contentStyle={{ color: '#000000' }}
          >
            <Descriptions.Item label="地区">{getArea(currentUser)}</Descriptions.Item>
            <Descriptions.Item label="用户类型">
              {USER_TYPE_MAP[currentUser?.role?.toUpperCase()]?.desc || '-'}
            </Descriptions.Item>
          </Descriptions>
          <Button type="primary" onClick={modalParams.showModal}>
            修改密码
          </Button>
        </div>
        <Modal {...modalParams.modalProps} title="修改密码" onOk={handleUpdatePwd}>
          <BasePwd icon={null} ref={pwdFormRef} />
        </Modal>
      </Card>
    </PageContainer>
  );
}
