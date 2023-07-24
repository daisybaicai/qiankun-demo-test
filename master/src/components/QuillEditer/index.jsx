import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { message, Upload } from 'antd';
import { request } from '@umijs/max';
import styles from './index.less';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          ['link'],
          ['image'],
        ],
        handlers: props?.useApi
          ? {
              image(value) {
                const { name = 'quill' } = props;
                if (value) {
                  document.querySelector(`#${name}`).click();
                }
              },
            }
          : {},
      },
    };
    this.formats = [
      'background',
      'bold',
      'color',
      'font',
      'code',
      'italic',
      'link',
      'size',
      'strike',
      'underline',
      'blockquote',
      'header',
      'indent',
      'list',
      'align',
      'direction',
      'code-block',
      'image',
      'video',
    ];
  }

  state = {
    text: '',
  };

  componentDidMount() {
    const { getEditor, name } = this.props;
    if (getEditor) {
      getEditor(this[name].getEditor());
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({ text: nextProps.value || '' });
    }
  }

  handleChange = (text) => {
    const { onChange } = this.props;
    this.setState({ text });
    if (onChange) {
      onChange(text);
    }
  };

  beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 <= 10;
    if (!isLt10M) {
      message.error('所选图片过大，请上传10M以内图片');
    }
    return isLt10M;
  };

  uploadHandler = (param) => {
    const { onError, file } = param;
    const { name = 'quill' } = this.props;
    const that = this;

    const formData = new FormData();
    formData.append('image', file);
    if (!file) {
      return false;
    }

    request('/api/v1/oss/uploadImage', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.code === 200) {
          const quill = that[name]?.getEditor(); // 获取到编辑器本身
          const cursorPosition = quill.getSelection()?.index; // 获取当前光标位置
          quill.insertEmbed(cursorPosition, 'image', response?.data?.url); // 插入图片
          quill.setSelection(cursorPosition + 1); // 光标位置加1
          return;
        }
        onError();
      })
      .catch((e) => {
        onError(e);
      });
    return true;
  };

  render() {
    const { text } = this.state;
    const { name = 'quill', height = '300px' } = this.props;

    return (
      <div className={styles.myEditor}>
        <ReactQuill
          ref={(ref) => {
            this[name] = ref;
          }}
          modules={this.modules}
          formats={this.formats}
          value={text}
          onChange={this.handleChange}
          style={{ height }}
        />
        <Upload
          id={name}
          name="image"
          accept="image/*"
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          customRequest={(param) => this.uploadHandler(param)}
        >
          <button type="button" className="control-item button upload-button">
            插入图片
          </button>
        </Upload>
      </div>
    );
  }
}
