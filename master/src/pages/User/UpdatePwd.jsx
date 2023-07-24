import React, { useRef } from 'react';
import { Form, Input, message, Button, Card, Alert } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import BasePwd from '@/components/BasePwd';
import styles from './index.less';

const UpdatePwd = () => {
  // eslint-disable-next-line no-unused-vars
  const { initialState, setInitialState } = useModel('@@initialState');

  const { currentUser } = initialState;

  const pwdFormRef = useRef();
  const [form] = Form.useForm();

  if (!currentUser?.firstLogin) {
    history.replace('/');
  }

  function handleSubmit() {
    pwdFormRef.current?.validateFields().then((values) => {
      const payload = pwdFormRef.current?.formatFieldsValue(values);
      // 修改密码接口
      console.log('payload', payload);
      message.success('修改密码成功');
      history.replace('/');
    });
  }

  return (
    <PageContainer title="修改初始密码">
      <div style={{ padding: '30px', background: '#fff' }}>
        <Alert message="为了您的账户安全，您需要修改初始密码。" type="info" showIcon />
        <Card bordered={false} className={styles.updatePwd}>
          <Form name="register" form={form} className={styles.form}>
            <Form.Item>
              <Input autocomplete="new-password" disabled value={currentUser.name} />
            </Form.Item>
            <BasePwd ref={pwdFormRef} hiddenLabel />
            <Form.Item>
              {/* <Button type="primary" onClick={() => handleSubmit()} loading={loading}> */}
              <Button type="primary" onClick={() => handleSubmit()}>
                确认
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default UpdatePwd;
