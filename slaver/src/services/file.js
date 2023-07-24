import { stringify } from 'qs';
import { request } from 'umi';
import { HOST } from './host';

// 文件上传
export async function fetchFileUpload(params) {
  return request(`${HOST}/file/upload`, {
    method: 'POST',
    body: params,
  });
}

