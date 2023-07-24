import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Col } from 'antd';
import {
  EditableProTable,
  ProForm,
  ProFormCheckbox,
  ProFormDigit,
  ProFormDigitRange,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import ApplyItem from '@/components/ApplyItem';
import loadApplyItem from '@/components/ApplyItem/loadApplyItem';
import BaseCascader from '@/components/BaseCascader';
import BaseDatePicker from '@/components/BaseDatePicker';
import EmailSearch from '@/components/EmailSearch';
import FileUpload from '@/components/FileUpload';
import { UPLOAD_TYPE } from '@/components/FileUpload/fileUtils';
import { useEditableProTableParams } from '@/utils/hooks';
import { isEmptyArray } from '@/utils/utils';
import { FORM_ITEM_TYPE } from '@/common/enum';
import { PATTERN } from '@/common/pattern';
import { getNormalRules } from '@/common/project';

const FORM_LAYOUT = {
  sm: 24,
  md: 12,
  xl: 8,
};

const ACTION = `https://mock.apifox.cn/m1/1961007-0-default/api/v1/file/upload`;
const defaultOptions = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
];
const proTableColumns = [
  {
    title: '活动名称',
    dataIndex: 'title',
    width: '30%',
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项是必填项',
        },
      ],
    },
    renderFormItem: () => {
      return <EmailSearch />;
    },
  },
  {
    title: '附件',
    dataIndex: 'file',
    renderFormItem: (_, { record }) => {
      return (
        <FileUpload
          uploadType={UPLOAD_TYPE.PICTURE.code}
          accept={['png', 'jpeg', 'jpg']}
          fileLen={1}
          action={ACTION}
        />
      );
    },
    render: (val) => {
      return <ApplyItem value={val} type="file" />;
    },
  },
  {
    title: '操作',
    valueType: 'option',
    render: () => '-',
  },
];

const TemplatesForm = React.memo(
  forwardRef(({ readonly = false, value = {} }, ref) => {
    const formRef = useRef();
    useImperativeHandle(ref, () => {
      return {
        submit: handleSubmit,
        getFieldsValue: formRef.current?.getFieldsValue,
        setFieldsValue: formRef.current?.setFieldsValue,
        scrollToField: formRef.current?.scrollToField,
      };
    });
    const proTableParams = useEditableProTableParams(value?.list1, readonly);

    const handleSubmit = (cb = () => {}) => {
      formRef.current.validateFields().then((values) => {
        cb(values);
      });
    };

    useEffect(() => {
      if (value && formRef && typeof formRef.current?.setFieldsValue === 'function') {
        formRef.current?.setFieldsValue({
          ...value,
        });
      }
    }, [value]);

    return (
      <ProForm
        name="templates-form"
        formRef={formRef}
        onValuesChange={(_, values) => {
          console.log(values);
        }}
        grid
        rowProps={{
          gutter: [20, 20],
        }}
        layout="horizontal"
        readonly={readonly}
        submitter={false}
        initialValues={value}
        requiredMark={readonly ? false : true}
      >
        <ProForm.Group>
          <ProFormText
            name="entName"
            label="企业名称"
            colProps={FORM_LAYOUT}
            rules={getNormalRules('企业名称', {
              pattern: PATTERN.CH_EN,
              maxLen: 20,
            })}
            validateFirst
          />
          <ProFormText
            name="endCode"
            label="统一社会信用代码"
            colProps={FORM_LAYOUT}
            rules={getNormalRules('统一社会信用代码', {
              pattern: PATTERN.CREDIT_CODE,
              validateLen: false,
            })}
            validateTrigger="onBlur"
            validateFirst
          />
          <ProFormText
            name="mobile"
            label="联系方式"
            colProps={FORM_LAYOUT}
            rules={getNormalRules('联系方式', {
              pattern: PATTERN.PHONE,
              validateLen: false,
            })}
            validateTrigger="onBlur"
            validateFirst
          />
          <ProFormSelect
            name="status"
            label="企业状态"
            colProps={FORM_LAYOUT}
            options={[
              {
                value: 'enable',
                label: '启用中',
              },
              {
                value: 'disable',
                label: '禁用中',
              },
            ]}
            rules={getNormalRules('企业状态', { select: true })}
            validateFirst
          />
          <ProFormRadio.Group
            name="type"
            label="企业类型"
            radioType="button"
            fieldProps={{
              buttonStyle: 'solid',
            }}
            colProps={FORM_LAYOUT}
            options={[
              {
                label: '工业',
                value: 'a',
              },
              {
                label: '农业',
                value: 'b',
              },
            ]}
            rules={getNormalRules('企业类型', { select: true })}
            validateFirst
          />
          <ProFormCheckbox.Group
            name="level"
            label="级别"
            colProps={FORM_LAYOUT}
            options={['A', 'B', 'C', 'D', 'E', 'F']}
            rules={getNormalRules('级别', { select: true })}
            validateFirst
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea
            name="address"
            label="联系地址"
            colProps={{
              ...FORM_LAYOUT,
              xl: 16,
            }}
            fieldProps={{ showCount: true, maxLength: 200 }}
          />
        </ProForm.Group>
        <ProForm.Group>
          <Col {...FORM_LAYOUT}>
            <ProForm.Item
              name="email"
              label="邮箱"
              rules={getNormalRules('邮箱', {
                pattern: PATTERN.EMAIL,
                validateLen: false,
              })}
              validateFirst
            >
              {loadApplyItem(<EmailSearch placeholder="请输入邮箱" />, !readonly)}
            </ProForm.Item>
          </Col>
          <Col {...FORM_LAYOUT}>
            <ProForm.Item
              name="date"
              label="日期"
              rules={getNormalRules('日期', {
                select: true,
              })}
              validateFirst
            >
              {loadApplyItem(
                <BaseDatePicker
                  type={FORM_ITEM_TYPE.DATE.code}
                  placeholder="请选择日期"
                  formatTimeStamp={false}
                />,
                !readonly,
              )}
            </ProForm.Item>
          </Col>
          <ProFormDigitRange
            name="numRange"
            label="数值区间"
            colProps={FORM_LAYOUT}
            fieldProps={{ precision: 2 }}
            rules={[
              {
                validator: (_, val) => {
                  const [num1, num2] = val || [];
                  if (!val || num1 === undefined || num2 === undefined) {
                    return Promise.reject(new Error('请输入数值'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            validateTrigger="onBlur"
            validateFirst
            required
          />
          <ProFormDigit
            name="num"
            label="单一数值"
            colProps={FORM_LAYOUT}
            fieldProps={{ precision: 0 }}
            rules={getNormalRules('数值', {
              required: true,
              validateLen: false,
            })}
            validateFirst
            min={0}
            max={999999}
          />
          <Col {...FORM_LAYOUT}>
            <ProForm.Item
              label="附件"
              name="file"
              rules={[
                {
                  validator: (_, val) => {
                    if (isEmptyArray(val)) {
                      return Promise.reject(new Error('请上传附件'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              validateFirst
              required
            >
              <FileUpload
                accept={['pdf', 'doc', 'docx']}
                fileLen={1}
                limitSize={20}
                uploadType={UPLOAD_TYPE.BUTTON.code}
                action={ACTION}
                tooltipTitle="仅支持.pdf,.doc,.docx后缀的文件，文件大小不得超过20M"
                readonly={readonly}
              />
            </ProForm.Item>
          </Col>
          <Col {...FORM_LAYOUT}>
            <ProForm.Item
              name="area"
              label="地区（级联）"
              rules={[
                {
                  validator: (_, val) => {
                    if (!val || isEmptyArray(val)) {
                      return Promise.reject(new Error('请选择地区'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              validateFirst
              required
            >
              {loadApplyItem(
                <BaseCascader
                  placeholder="请选择"
                  defaultOptions={defaultOptions}
                  isFetch={false}
                  fieldNames={{ label: 'label', value: 'value' }}
                  changeOnSelect={false}
                />,
                !readonly,
                'text',
                (val) => val?.join('/') || '-',
              )}
            </ProForm.Item>
          </Col>
          <ProForm.Item name="list1" trigger="onValuesChange" noStyle>
            <EditableProTable
              headerTitle="可编辑表格示例"
              rowKey="id"
              columns={proTableColumns}
              {...proTableParams.props}
              recordCreatorProps={readonly ? false : proTableParams.props?.recordCreatorProps}
              toolBarRender={null}
              maxLength={5}
            />
          </ProForm.Item>
        </ProForm.Group>
      </ProForm>
    );
  }),
);

export default TemplatesForm;
