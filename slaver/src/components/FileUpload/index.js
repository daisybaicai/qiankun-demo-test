import React, { useState, useEffect, forwardRef } from 'react';
import { Upload, Button, message, Tooltip } from 'antd';
import classNames from 'classnames';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { getAcceptTypes, validateFileType } from './fileEnum';
import { fetchFileUpload } from '@/services/file';
import { fileDownLoad } from '@/utils/file';
import styles from './index.less';


const { Dragger } = Upload;

const FileUpload = forwardRef(
  (
    {
      uploadText = '上传文件',
      value = [],
      onChange = () => {},
      fileLen = 1,
      type = 'upload',
      style,
      disabled = false,
      accept = '',
      limitSize = 5,
      tooltipTitle = '支持扩展名：.jpg .jpeg .png .bmp .pdf',
      suffix = true,
      className,
      isButton = true,
      showUploadList = {
        showDownloadIcon: true
      },
      uploadFn = () => {},
    },
    _ref,
  ) => {
    const [fileList, setFileList] = useState(value || []);
    const [fileKeysList, setFileKeysList] = useState(value || []);
    const strClass = classNames(styles.myUpload, className);

    const triggerChange = (list) => {
      setFileKeysList(list);
      return onChange && onChange(list);
    };

    useEffect(() => {
      if (fileList.length === 0 && value instanceof Array && value.length > 0) {
        setFileKeysList(value);
        setFileList(value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const beforeUploadImgLimit = (file, fList, limit = 5) => {
      const limitType = accept ? validateFileType(accept, file, suffix) : true;
      // const limitType = true;
      if (!limitType) {
        message.error('请按照正确格式上传');
        return false;
      }
      const isLimited = file.size / 1024 / 1024 < limit;
      if (!isLimited) {
        message.error(`请上传${limit}MB以下的文件`);
        return false;
      }
      if (fileLen > 1) {
        const disLen = fileList.length + fList.length - fileLen;
        const restLen = fileLen - fileList.length;
        const newfList = fList.slice(restLen);
        if (disLen > 0 && newfList.includes(file)) {
          message.error(`最多上传${fileLen}份文件`);
          return false;
        }
        return true;
      }
      return true;
    };

    /**
     * 文件上传
     * @param {*} info
     */
    const handleChange = (info) => {
      console.log('info',info);
      const { file, fileList: infoFileList } = info;
      let fList = [];
      if (fileLen === 1) {
        fList = infoFileList.slice(-1);
        fList = fList.filter((f) => !!f.status);
      } else {
        fList = infoFileList.filter((f) => !!f.status);
      }
      if (!file.status) {
        return;
      }
      fList.forEach((f, index) => {
        if (f.status === 'done' && f.response && f.response.code === 0) {
          const { data } = f.response;
          fList[index] = {
            ...fList[index],
            key: fList[index]?.key || data?.fileKey,
          };
        }
      });
      const fKeys = [];
      fList.forEach((f) => {
        if (f.response && f.response.code === 0) {
          const { data } = f.response;
          fKeys.push({
            key: data.fileKey,
            name: f.name,
            uid: f.uid,
            status: 'done',
          });
        }
      });
      setFileList(fList);
      if (file && file.status === 'done') {
        triggerChange(fList);
      }
    };

    /**
     * 删除
     * @param {*} file
     */
    const handleRemove = (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      const newFileKeysList = fileKeysList.filter((item) => item.uid !== file.uid);
      newFileList.splice(index, 1);
      triggerChange(newFileKeysList);
      setFileList(newFileList);
    };


    const uploadFile = (file, onSuccess = () => {}, onError = () => {}) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', value.name);
      return fetchFileUpload(formData).then((res) => {
        if (res?.code === 200) {
          onSuccess(res?.data?.id);
          uploadFn(formData);
        }
      })
      .catch((e) => {
        onError(e);
      });
      // return fetch(data?.url, {
      //   method: 'PUT',
      //   body: file,
      // })
      //   .then((res) => {
      //     if (res?.status === 200) {
      //       onSuccess(data?.fileId);
      //     }
      //   })
      //   .catch((e) => {
      //     onError(e);
      //   });
    };

    /**
     * 手动上传
     * @param {*} options
     */
    const handleMyUpload = (options) => {
      const { onSuccess, onError, file } = options;
      const onSuccessCallBack = (fKey) => {
        const res = {
          code: 0,
          data: {
            fileKey: fKey,
          },
        };
        onSuccess(res);
      };
      const onErrorCallBack = (e) => {
        const err = new Error('上传失败');
        onError({ err });
        message.error('上传失败');
      };
      return uploadFile(file, onSuccessCallBack, onErrorCallBack);
      // return retrieveNewURL(
      //   file,
      //   (f, onSuccessCb, onErrorCb) => {
      //     uploadFile(f, onSuccessCb, onErrorCb);
      //   },
      //   onSuccessCallBack,
      //   onErrorCallBack,
      // );
    };

    const handleDownload = (file) => {
      fileDownLoad(file?.key, file?.name);
    }

    const uploadProps = {
      name: 'file',
      multiple: fileLen > 1,
      withCredentials: true,
      fileList,
      accept: getAcceptTypes(accept, suffix),
      beforeUpload: (file, fList) => beforeUploadImgLimit(file, fList, limitSize),
      onChange: handleChange,
      onRemove: handleRemove,
      disabled,
      showUploadList,
      customRequest: handleMyUpload,
      onDownload: handleDownload,
      onPreview: handleDownload
    };

    if (type === 'drag') {
      return (
        <Dragger {...uploadProps} style={style}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p className="ant-upload-hint">{tooltipTitle}</p>
        </Dragger>
      );
    }

    if (type === 'button') {
      return (
        <div className={strClass}>
          <Upload {...uploadProps} style={style}>
            <Tooltip placement="top" title={tooltipTitle}>
              <Button>
                <UploadOutlined /> {uploadText}
              </Button>
            </Tooltip>
          </Upload>
        </div>
      );
    }

    return (
      <div className={strClass}>
        <Upload {...uploadProps}>
          {
            isButton ? (
              <Button className={styles.uploadBtn}>
                <UploadOutlined /> {uploadText}
              </Button>
            ) : (
              <a
                style={{color: '#6270F4'}}
              >
                上传附件
              </a>
            )
          }
          
          <p className="ant-upload-hint" style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
            {tooltipTitle}
          </p>
        </Upload>
      </div>
    );
  },
);

export default FileUpload;
