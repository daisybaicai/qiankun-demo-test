import React from 'react';
import {
  Button,
  Card,
  Form,
  message,
  Popconfirm,
  Checkbox,
  Input,
  InputNumber,
  Radio,
  Select,
  Anchor,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { EditableProTable, ProFormDigitRange, PageContainer } from '@ant-design/pro-components';
import ApplyItem from '@/components/ApplyItem';
import loadApplyItem from '@/components/ApplyItem/loadApplyItem';
import BaseCascader from '@/components/BaseCascader';
import BaseDatePicker from '@/components/BaseDatePicker';
import EmailSearch from '@/components/EmailSearch';
import FileUpload from '@/components/FileUpload';
import { UPLOAD_TYPE } from '@/components/FileUpload/fileUtils';
import FormItemGroup from '@/components/FormItemGroup';
import QuillEditer from '@/components/QuillEditer';
import { useEditableProTableParams } from '@/utils/hooks';
import { isEmptyArray } from '@/utils/utils';
import { FORM_ITEM_TYPE } from '@/common/enum';
import { PATTERN } from '@/common/pattern';
import { getNormalRules } from '@/common/project';
import styles from './index.less';

const FORM_LAYOUT = {
  sm: 24,
  md: 12,
  xl: 8,
};

const ACTION = `https://mock.apifox.cn/m1/1961007-0-default/api/v1/file/upload`;
const ZIPACTION = `https://mock.apifox.cn/m1/1961007-0-default/api/v1/file/upload/compressed-file`;
const request = (action, props) => {
  console.log('action', action, 'props', props);
  return Promise.resolve({
    code: 0,
    data: { fileKey: 'sss', fileName: 'xxx.jpg' },
  });
};
const fetchXXX = () => {
  return Promise.resolve({
    code: 0,
    data: { fileKey: 'sss', fileName: 'xxx.jpg' },
  });
};
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

const anchorList = [
  {
    key: 'part-1',
    href: '#part-1',
    title: '业务示例',
  },
  {
    key: 'part-2',
    href: '#part-2',
    title: '日期示例',
  },
  {
    key: 'part-3',
    href: '#part-3',
    title: '文件上传示例',
  },
];
export default function Detail({ readonly = false }) {
  const proTableParams = useEditableProTableParams();
  const { form } = Form.useForm();
  const handleSave = () => {
    const values = form?.getFieldsValue();
    console.log('🚀 ~ file: Form.jsx:110 ~ handleSave ~ values', values);
    // TODO: 保存请求
    message.success('保存成功');
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('🚀 ~ file: Form.jsx:117 ~ handleSubmit ~ values', values);
      // TODO: 提交请求
      message.success('提交成功');
    });
  };

  return (
    <PageContainer
      title="表单"
      breadcrumb={null}
      footer={[
        <Button key="save" onClick={handleSave}>
          保存
        </Button>,
        <Popconfirm title="确认提交吗？" key="submit" onConfirm={handleSubmit}>
          <Button key="submit" type="primary">
            提交
          </Button>
        </Popconfirm>,
      ]}
    >
      <div className={styles.formContainer}>
        <Card bordered={false}>
          <Form
            name="base-form"
            form={form}
            onValuesChange={(_, values) => {
              console.log(values);
            }}
            layout="horizontal"
            requiredMark={readonly ? false : true}
          >
            <Card title="业务示例" type="inner" id="part-1">
              <FormItemGroup>
                <Form.Item
                  name="entName"
                  label="企业名称"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('企业名称', {
                    pattern: PATTERN.CH_EN,
                    maxLen: 20,
                  })}
                  validateFirst
                >
                  {loadApplyItem(<Input placeholder="请输入" />, !readonly)}
                </Form.Item>
                <Form.Item
                  name="endCode"
                  label="统一社会信用代码"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('统一社会信用代码', {
                    pattern: PATTERN.CREDIT_CODE,
                    validateLen: false,
                  })}
                  validateFirst
                >
                  {loadApplyItem(<Input placeholder="请输入" />, !readonly)}
                </Form.Item>
                <Form.Item
                  name="mobile"
                  label="联系方式"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('联系方式', {
                    pattern: PATTERN.PHONE,
                    validateLen: false,
                  })}
                  validateTrigger="onBlur"
                  validateFirst
                >
                  {loadApplyItem(<Input placeholder="请输入" />, !readonly)}
                </Form.Item>

                <Form.Item
                  name="status"
                  label="企业状态"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('企业状态', { select: true })}
                  validateFirst
                >
                  {loadApplyItem(
                    <Select placeholder="请选择">
                      {[
                        {
                          value: 'enable',
                          label: '启用中',
                        },
                        {
                          value: 'disable',
                          label: '禁用中',
                        },
                      ].map((item) => (
                        <Select.Option value={item.value} key={item.value}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>,
                    !readonly,
                  )}
                </Form.Item>
                <Form.Item
                  name="type"
                  label="企业类型"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('企业类型', { select: true })}
                  validateFirst
                >
                  {loadApplyItem(
                    <Radio.Group buttonStyle="solid">
                      {[
                        {
                          label: '工业',
                          value: 'a',
                        },
                        {
                          label: '农业',
                          value: 'b',
                        },
                      ].map((item) => (
                        <Radio.Button value={item.value} key={item.value}>
                          {item.label}
                        </Radio.Button>
                      ))}
                    </Radio.Group>,
                    !readonly,
                  )}
                </Form.Item>
                <Form.Item
                  name="level"
                  label="级别"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('级别', { select: true })}
                  validateFirst
                >
                  {loadApplyItem(
                    <Checkbox.Group>
                      {['A', 'B', 'C', 'D', 'E', 'F'].map((v) => (
                        <Checkbox value={v} key={v}>
                          {v}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>,
                    !readonly,
                  )}
                </Form.Item>
              </FormItemGroup>
              <FormItemGroup>
                <Form.Item
                  name="address"
                  label="联系地址"
                  colProps={{
                    ...FORM_LAYOUT,
                    xl: 16,
                  }}
                >
                  {loadApplyItem(<Input.TextArea maxLength={200} showCount />, !readonly)}
                </Form.Item>
              </FormItemGroup>
              <FormItemGroup>
                <Form.Item
                  name="email"
                  label="邮箱"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('邮箱', {
                    pattern: PATTERN.EMAIL,
                    validateLen: false,
                  })}
                  validateFirst
                >
                  {loadApplyItem(<EmailSearch placeholder="请输入邮箱" />, !readonly)}
                </Form.Item>
                <Form.Item
                  name="date"
                  label="日期"
                  colProps={FORM_LAYOUT}
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
                </Form.Item>
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
                  required
                  readonly={readonly}
                />
                <Form.Item
                  name="num"
                  label="单一数值"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('数值', {
                    required: true,
                    validateLen: false,
                  })}
                  validateFirst
                >
                  {loadApplyItem(
                    <InputNumber
                      min={0}
                      max={999999}
                      precision={0}
                      placeholder="请输入"
                      style={{ width: '100%' }}
                    />,
                    !readonly,
                  )}
                </Form.Item>
                <Form.Item
                  label="附件"
                  name="file"
                  colProps={FORM_LAYOUT}
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
                </Form.Item>
                <Form.Item
                  name="area"
                  label="地区（级联）"
                  colProps={FORM_LAYOUT}
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
                </Form.Item>
              </FormItemGroup>
              <Form.Item
                label="富文本编辑"
                name="content"
                rules={[
                  {
                    required: true,
                    message: '请输入正文文本',
                  },
                ]}
              >
                <QuillEditer />
              </Form.Item>
              <Form.Item name="list1" trigger="onValuesChange" noStyle>
                <EditableProTable
                  headerTitle="可编辑表格示例"
                  rowKey="id"
                  columns={proTableColumns}
                  {...proTableParams.props}
                  recordCreatorProps={readonly ? false : proTableParams.props?.recordCreatorProps}
                  toolBarRender={null}
                  maxLength={5}
                  readonly={readonly}
                />
              </Form.Item>
            </Card>
            <Card title="日期示例" type="inner" style={{ marginTop: 20 }} id="part-2">
              <FormItemGroup>
                <Form.Item
                  name="date"
                  label="日期"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('日期', {
                    select: true,
                  })}
                  validateFirst
                >
                  <BaseDatePicker
                    type={FORM_ITEM_TYPE.DATE.code}
                    placeholder="请选择日期"
                    formatTimeStamp={false} //  不使用时间戳返回
                    disabledAfter // 可选范围：当天往前两年到当天往后一年
                    disabledAfterLimit={1}
                    disabledBefore
                    disabledBeforeLimit={2}
                  />
                </Form.Item>
                <Form.Item
                  name="year"
                  label="年份"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('日期', {
                    select: true,
                  })}
                  validateFirst
                >
                  <BaseDatePicker
                    picker="year"
                    format="YYYY"
                    disabledBefore
                    type={FORM_ITEM_TYPE.DATE.code}
                    placeholder="请选择年份"
                  />
                </Form.Item>
                <Form.Item
                  name="dateRange"
                  label="时间段"
                  colProps={FORM_LAYOUT}
                  rules={getNormalRules('日期', {
                    select: true,
                  })}
                  validateFirst
                >
                  <BaseDatePicker
                    disabledAfter
                    disabledAfterLimit={1} // 可选范围：截止到当天往后一天
                    disabledLimitUnit="days"
                    onChange={(value) => console.log('dateRange', value)}
                  />
                </Form.Item>
              </FormItemGroup>
            </Card>

            <Card title="文件上传示例" type="inner" style={{ marginTop: 20 }} id="part-3">
              <Form.Item label="按钮文件上传" name="file1">
                <FileUpload
                  accept={[]}
                  fileLen={10}
                  uploadType={UPLOAD_TYPE.BUTTON.code}
                  action={ACTION}
                  tooltipTitle=""
                />
              </Form.Item>
              <Form.Item label="图片上传" name="file2">
                <FileUpload
                  accept={['jpg', 'jpeg', 'png']}
                  fileLen={10}
                  uploadType={UPLOAD_TYPE.PICTURE.code}
                  action={ACTION}
                  tooltipTitle=""
                />
              </Form.Item>
              <Form.Item label="图片裁剪上传" name="file22">
                <FileUpload
                  accept={['jpg', 'jpeg', 'png']}
                  fileLen={10}
                  uploadType={UPLOAD_TYPE.PICTURE.code}
                  action={ACTION}
                  crop
                  tooltipTitle=""
                  imgCropProps={{}} // 裁剪属性
                />
              </Form.Item>
              <Form.Item label="文件拖拽上传" name="file3">
                <FileUpload
                  accept={['jpg', 'jpeg', 'png']}
                  fileLen={10}
                  uploadType={UPLOAD_TYPE.DRAG.code}
                  action={ACTION}
                  tooltipTitle=""
                />
              </Form.Item>
              <Form.Item label="自定义文件上传" name="file4">
                <FileUpload
                  fileLen={10}
                  accept={[]}
                  uploadType={UPLOAD_TYPE.CUSTOM.code}
                  action={ACTION}
                  transferBlob
                  reqFileMap={{ file: 'contentBase64', fileName: 'originName' }}
                  customUpload
                  request={request}
                  extraParams={{ recordId: 2 }} // 上传文件其他参数，如传给后端需要当前记录recordId
                >
                  <a>
                    <UploadOutlined /> 上传
                  </a>
                </FileUpload>
              </Form.Item>
              <Form.Item label="压缩包解压文件上传" name="file5">
                <FileUpload
                  fileLen={10}
                  uploadType={UPLOAD_TYPE.BUTTON.code}
                  accept={['zip', 'jpeg', 'png', 'pdf', 'xlsx', 'xls']}
                  action={ACTION}
                  tooltipTitle="仅支持zip，jpeg, png, pdf"
                  unZipAction={ZIPACTION}
                  unZipFile
                />
              </Form.Item>
              <Form.Item label="自定义文件上传方法（传入request）" name="file9">
                <FileUpload
                  fileLen={10}
                  uploadType={UPLOAD_TYPE.BUTTON.code}
                  accept={['zip', 'jpeg', 'png', 'pdf']}
                  action={ACTION}
                  tooltipTitle="仅支持zip，jpeg, png, pdf"
                  customUpload
                  request={request}
                />
              </Form.Item>
              <Form.Item label="自定义文件上传方法(传入异步函数）" name="file10">
                <FileUpload
                  fileLen={10}
                  uploadType={UPLOAD_TYPE.BUTTON.code}
                  accept={['zip', 'jpeg', 'png', 'pdf']}
                  action={ACTION}
                  tooltipTitle="仅支持zip，jpeg, png, pdf"
                  ignoreAction
                  customUpload
                  request={(props) => {
                    console.log('props', props);
                    const { data, processData, method, config } = props;
                    return fetchXXX({ data, processData, method, config }); // 传入所需参数
                  }}
                />
              </Form.Item>
            </Card>
          </Form>
        </Card>
        <Anchor offsetTop={160}>
          {anchorList.map((item) => (
            <Anchor.Link key={item.key} {...item} />
          ))}
        </Anchor>
      </div>
    </PageContainer>
  );
}
