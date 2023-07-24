import { FILE_BASE64_MAP } from '@/common/enum';

/**
 * 文件转base64
 * @param {*} File
 */
 export const parseFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * base64转文件流
 * @param {*} dataurl base64转文件流
 * @param {*} type 文件类型
 */
export const dataURLtoBlob = (dataurl,type) => {
  // 注意base64的最后面中括号和引号是不转译的   
  const arr = dataurl;
  const mime = getBase64Type(type);
  const bstr =window.atob(arr);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n > 0) {
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}

/**
 * 文件下载
 * @param {*} file 文件流
 * @param {*} type 文件名
 */
export const fileDownLoad = (file, name) => {
  const blobUrl = window.URL.createObjectURL(file);
  const aElement = document.createElement('a');
  aElement.href = blobUrl; // 设置a标签路径
  aElement.download = name;
  aElement.click();
  window.URL.revokeObjectURL(blobUrl);
};

