import React, { useRef, useState, useEffect } from 'react';
import { Button, Card, Form, Input, message, Result, Steps } from 'antd';
import { ProFormCaptcha } from '@ant-design/pro-components';
import { useInterval } from 'ahooks';
import BasePwd from '@/components/BasePwd';
import BaseStepsForm from '@/components/BaseStepsForm';
import { usePageProps } from '@/utils/hooks';
import { PATTERN } from '@/common/pattern';
import { getNormalRules } from '@/common/project';
import styles from './index.less';

const Step1 = React.memo(() => {
  return (
    <>
      <Form.Item
        name="name"
        label="单位名称"
        rules={getNormalRules('单位名称', { required: true, maxLen: 30 })}
        validateFirst
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item
        name="address"
        label="单位地址"
        rules={getNormalRules('单位地址', {
          required: true,
          maxLen: 50,
        })}
        validateFirst
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="手机"
        rules={getNormalRules('手机', {
          required: true,
          maxLen: 11,
          pattern: PATTERN.PHONE,
        })}
        validateFirst
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item
        name="contact"
        label="联系人"
        rules={getNormalRules('联系人', {
          required: true,
          maxLen: 30,
          pattern: PATTERN.NO_WHITE_CH_NAME,
        })}
        validateFirst
      >
        <Input placeholder="请输入" />
      </Form.Item>
    </>
  );
});

const Step2 = React.memo(({ form }) => {
  const pwdRef = useRef();
  return (
    <>
      <Form.Item
        name="username"
        label="账号"
        rules={getNormalRules('账号', {
          required: true,
          maxLen: 30,
          pattern: PATTERN.NO_WHITE_CH_EN_NUM,
        })}
        validateFirst
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="手机"
        rules={getNormalRules('手机', { required: true, maxLen: 11, pattern: PATTERN.PHONE })}
        validateTrigger="onBlur"
        validateFirst
      >
        <Input placeholder="请输入" disabled />
      </Form.Item>
      <ProFormCaptcha
        phoneName="phone"
        name="smsCode"
        label="验证码"
        rules={[
          {
            required: true,
            message: '请输入验证码',
          },
        ]}
        placeholder="请输入验证码"
        onGetCaptcha={async (phone) => {
          // todo: 发送验证码
          console.log('phone', phone);
          message.success('验证码发送成功');
          return Promise.resolve();
        }}
      />
      <BasePwd hideOldPwd initPwd icon={null} customForm={form} ref={pwdRef} />
    </>
  );
});

const StepResult = React.memo(() => {
  const { history } = usePageProps();
  // 处理倒计时跳转
  const [interval, setInterval] = useState(undefined);
  const [count, setCount] = useState(5);
  const handleGo = () => {
    history.push('/templates/list');
  };

  useInterval(
    () => {
      if (count > 0) {
        setCount(count - 1);
      }
      if (count === 0) {
        setInterval(undefined);
        handleGo();
      }
    },
    interval,
    {
      immediate: false,
    },
  );

  return (
    <Result
      status="success"
      title="提交成功!"
      subTitle={`提交成功，${count}s 后自动跳转列表页面， 或点击按钮跳转`}
      extra={[
        <Button key="buy" onClick={handleGo}>
          返回
        </Button>,
      ]}
    />
  );
});
const commonFormLayouts = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
  layout: 'vertical',
};

const currentSteps = {
  0: '待填写',
  1: '请填写',
  2: '已完成',
};

const RegisterStep = () => {
  const { history } = usePageProps();

  const stepFormRef = useRef();
  const step1Ref = useRef();
  const step2Ref = useRef();
  const step3Ref = useRef();

  // 解决自定义步骤条,可以通过stepsProps 传入null，然后再上面自定义步骤条
  const [parentStep, setParentStep] = useState(stepFormRef?.current?.step || 0);
  useEffect(() => {
    setParentStep(stepFormRef?.current?.step || 0);
  }, []);

  const handleFinalSubmit = (v) => {
    return new Promise((resolve) => {
      message.success('提交成功');
      resolve();
    });
  };

  return (
    <div className={styles.registerStep}>
      <div className={styles.topCard}>
        <div className={styles.title}>
          单位注册 <span>欢迎进行单位注册，请根据以下步骤进行</span>
        </div>
        <div className={styles.steps}>
          <Steps
            current={parentStep}
            items={[
              {
                title: '企业基本信息',
                description: parentStep <= 0 ? '请填写' : '已完成',
              },
              {
                title: '账号基本信息',
                description: currentSteps[parentStep],
              },
              {
                title: '完成',
              },
            ]}
          />
        </div>
      </div>
      <Card className={styles.bottomCard}>
        <BaseStepsForm
          ref={stepFormRef}
          onCurrentChange={(v) => {
            setParentStep(v);
          }}
          stepsProps={null}
          onFinish={(v) => {
            return handleFinalSubmit(v);
          }}
          submitter={{
            render: (props) => {
              if (props.step === 0) {
                return (
                  <div className={styles.footer}>
                    <Button
                      onClick={() => {
                        history.push('/templates/list');
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        // 提交当前表单, 并且跳转下一步
                        props.onSubmit().then(() => {
                          props?.onNext();
                          // 第二步初始表单
                          step2Ref.current?.setFieldsValue({
                            phone: step1Ref?.current?.getFieldValue('phone'),
                            username: 'asd',
                          });
                        });
                      }}
                    >
                      下一步
                    </Button>
                  </div>
                );
              }

              if (props.step === 1) {
                return (
                  <div className={styles.footer}>
                    <Button key="pre" onClick={() => props.onPre?.()}>
                      返回上一步
                    </Button>
                    <Button
                      type="primary"
                      key="next"
                      onClick={() =>
                        // 提交所有表单, 并且跳转下一步
                        props.onFinalSubmit?.()?.then(() => {
                          props?.onNext();
                        })
                      }
                    >
                      提交
                    </Button>
                  </div>
                );
              }

              if (props.step === 2) {
                return [];
              }

              return [null];
            },
          }}
        >
          <BaseStepsForm.StepForm ref={step1Ref} name="test1" {...commonFormLayouts}>
            <Step1 />
          </BaseStepsForm.StepForm>
          <BaseStepsForm.StepForm ref={step2Ref} name="test2" {...commonFormLayouts}>
            <Step2 form={step2Ref} />
          </BaseStepsForm.StepForm>
          <BaseStepsForm.StepForm ref={step3Ref} name="test3" {...commonFormLayouts}>
            <StepResult />
          </BaseStepsForm.StepForm>
        </BaseStepsForm>
      </Card>
    </div>
  );
};

export default RegisterStep;
