import React, { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { message, Tabs, Button, Form, Input, Modal } from 'antd';
import {
  LockOutlined,
  MobileOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import Captcha from '@/components/Captcha';
import { setProjectToken } from '@/utils/utils';
import logo from '@/assets/logo-title.svg';
import { fetchLogin, getFakeCaptcha } from '@/services/api';
import styles from './index.less';

const Login = () => {
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const captchaRef = useRef();
  const [code, setCode] = useState('');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleLogin = async (values) => {
    try {
      // 登录
      const res = await fetchLogin({
        ...values,
        type,
      });
      message.success('登录成功');
      setProjectToken(res?.data?.token);
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      setLoading(false);
    } catch (res) {
      setLoading(false);
      message.error(res?.message || '登录失败，请重试');
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { imgCode } = values;
      if (type === 'account') {
        if (!imgCode) {
          message.error('请输入验证码');
          return;
        }
        if (imgCode !== code) {
          message.error('验证码错误');
          return;
        }
      }
      setLoading(true);
      handleLogin(values);
    });
  };

  const handleClick = () => {
    captchaRef.current.refresh();
  };

  const handleChange = (captcha) => {
    setCode(captcha);
  };

  const handleReset = () => {
    Modal.warning({
      title: '请联系管理员重置密码',
      okText: '确定',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={logo} alt="logo" />
      </div>
      <div className={styles.content}>
        <div className={styles.login}>
          <div className={styles.welcome}>欢迎登录</div>
          <h3 className={styles.loginName}>后台管理模板</h3>
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            style={{ marginBottom: -20 }}
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
              {
                key: 'mobile',
                label: '手机号登录',
              },
            ]}
          />

          <div className={styles.form}>
            <Form form={form} style={{ width: '100%' }} name="login-form">
              {type === 'account' && (
                <>
                  <ProFormText
                    name="username"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className="prefixIcon" />,
                    }}
                    placeholder="请输入用户名"
                    rules={[
                      {
                        required: true,
                        message: '请输入用户名!',
                      },
                    ]}
                  />
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className="prefixIcon" />,
                    }}
                    placeholder="请输入密码"
                    rules={[
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ]}
                  />
                  <Form.Item validateTrigger="onBlur" validateFirst name="imgCode">
                    <div className={styles.code} style={{ display: 'flex' }}>
                      <Input
                        style={{ marginRight: '10px' }}
                        placeholder="请输入验证码"
                        size="large"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSubmit();
                          }
                        }}
                      />
                      <Captcha ref={captchaRef} onClick={handleClick} onChange={handleChange} />
                    </div>
                  </Form.Item>
                </>
              )}
              {type === 'mobile' && (
                <>
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
                      const result = await getFakeCaptcha({
                        phone,
                      });
                      if (result?.code === 0) {
                        message.success(result?.data || '验证码已发送');
                      } else {
                        message.error('验证码获取失败');
                      }
                    }}
                  />
                </>
              )}
            </Form>
          </div>
          <div className={styles.bottom}>
            <Button type="primary" size="large" loading={loading} onClick={handleSubmit}>
              登录
            </Button>
            <div className={styles.more}>
              <span>
                <ExclamationCircleOutlined style={{ marginRight: 4 }} />
                暂无账号？请进行<a onClick={() => history.push('/user/register')}>注册</a>
              </span>
              <a onClick={handleReset}>忘记密码?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
