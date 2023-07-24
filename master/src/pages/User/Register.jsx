import React, { useRef } from 'react';
import { message, Button, Form } from 'antd';
import { MobileOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import BasePwd from '@/components/BasePwd';
import logo from '@/assets/logo-title.svg';
import { getFakeCaptcha } from '@/services/api';
import styles from './index.less';

const Login = () => {
  const [form] = Form.useForm();
  const pwdFormRef = useRef();

  const handleSubmit = () => {
    Promise.all([pwdFormRef.current?.validateFields(), form.validateFields()]).then((res) => {
      let payload = {};
      res.forEach((item) => {
        payload = {
          ...payload,
          ...item,
        };
      });
      console.log('payload', payload);
      message.success('注册成功');
      history.push('/user/login');
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={logo} alt="logo" />
      </div>
      <div className={styles.content}>
        <div className={styles.login}>
          <div className={styles.welcome}>欢迎注册</div>
          <h3 className={styles.loginName}>后台管理模板</h3>

          <div className={styles.form}>
            <Form form={form} style={{ width: '100%' }} name="login-form">
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder="请输入手机号"
                rules={[
                  {
                    required: true,
                    message: '手机号是必填项',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '不合法的手机号',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder="请输入验证码"
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'秒后重新获取'}`;
                  }
                  return '获取验证码';
                }}
                phoneName="mobile"
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: '验证码是必填项',
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  console.log('phone', phone);
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (result?.code === 0) {
                    message.success(result?.data || '获取验证码失败');
                  }
                }}
              />
              <BasePwd ref={pwdFormRef} hiddenLabel initPwd hideOldPwd size="large" />
            </Form>
          </div>
          <div className={styles.bottom}>
            <Button type="primary" size="large" onClick={handleSubmit}>
              注册
            </Button>
            <div className={styles.more}>
              <span>
                <ExclamationCircleOutlined style={{ marginRight: 4 }} />
                已有账号？立即<a onClick={() => history.push('/user/login')}>登录</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
