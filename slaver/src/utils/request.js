import { request as normalRequest } from '@umijs/max';

export default function request(url, options = {}) {
  return normalRequest(url, options);
}
