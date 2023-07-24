export const fileTypeEnum = {
  pdf: 'application/pdf',
  jpeg: 'image/jpeg',
  png: 'image/png',
  jpg: 'image/jpg',
  bmp: 'image/bmp',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  zip: '.zip,application/zip',
  xml: 'text/xml, application/xml',
  xlw: 'application/vnd.ms-excel',
  xlt: 'application/vnd.ms-excel',
  txt: 'text/plain',
  doc: 'application/msword',
  docx: '.docx,application/msword',
  rar: '.rar,application/rar,application/x-rar-compressed',
};

/**
 * 获取http可接受上传文件类型
 * @param {Array} arr 可接受的文件类型后缀/accpetType
 * @param {Boolean} suffix 是否使用文件类型后缀
 */
export function getAcceptTypes(arr = [], suffix = true) {
  if (arr instanceof Array) {
    if (suffix) {
      let values = [];
      arr.forEach((item) => {
        let val = fileTypeEnum[item];
        val = val.split(',');
        values = values.concat(val);
      });
      return values.join(',');
    }
    return arr.join(',');
  }
  return '';
}

/**
 * 校验文件类型
 * @param {Array} arr 可接受的文件类型后缀/accpetType
 * @param {*} file 当前文件
 * @param {Boolean} suffix 是否使用文件类型后缀
 */
export function validateFileType(arr = [], file, suffix = true) {
  if (!file) {
    return false;
  }
  if (file.type) {
    if (suffix) {
      let values = [];
      arr.forEach((item) => {
        let val = fileTypeEnum[item];
        val = val.split(',');
        values = values.concat(val);
      });
      return values.includes(file.type);
    }
    return arr.includes(file.type);
  }
  if (!file.type && suffix) {
    const names = file.name.split('.');
    const fileSuffix = names.length > 0 && names[names.length - 1];
    return arr.includes(fileSuffix);
  }
  return false;
}

/**
 * 判断是否为压缩包格式
 * @param {*} file 当前文件
 * @param {Array} fileTypes 压缩包文件类型后缀
 */
export function isZip(file = {}, fileTypes = ['zip', 'rar']) {
  const { type, name } = file;
  if (type) {
    let values = [];
    fileTypeEnum.forEach((item) => {
      let val = fileTypeEnum[item];
      val = val.split(',');
      values = values.concat(val);
    });
    return values.includes(type);
  }
  const names = name.split('.');
  const fileSuffix = names.length > 0 && names[names.length - 1];
  return fileTypes.includes(fileSuffix);
}

/**
 * 校验文件
 * @param {*} v
 */
export function valiedateFile(v) {
  if (!v || (v instanceof Array && v.length === 0)) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('请上传文件');
  }
  return Promise.resolve();
}
