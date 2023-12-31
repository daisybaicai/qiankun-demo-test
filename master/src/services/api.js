import request from '@/utils/request';
import { HOST } from './host';

// 获取个人信息
export async function fetchProfile(options) {
  return request(`${HOST}/v1/user/info`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 登录
export async function fetchLogin(params, options) {
  return request(`${HOST}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
    ...(options || {}),
  });
}

// 发送验证码
export async function getFakeCaptcha(params, options) {
  return request(`${HOST}/login/captcha`, {
    method: 'GET',
    data: params,
    ...(options || {}),
  });
}

// 登出
export async function fetchLogout(options) {
  return request(`${HOST}/v1/auth/logout`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取消息 GET /api/notices */
export async function getNotices(options) {
  return request(`${HOST}/notices`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(params, options) {
  return request(`${HOST}/rule`, {
    method: 'GET',
    data: params,
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options) {
  return request(`${HOST}/rule`, {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options) {
  return request(`${HOST}/rule`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options) {
  return request(`${HOST}/rule`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function fetchRuleList(params, options) {
  return request(`${HOST}/rule`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取规则信息 GET /api/rule/:id */
export async function fetchRuleDetail(params, options) {
  return request(`${HOST}/rule/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
