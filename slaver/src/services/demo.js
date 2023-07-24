import { stringify } from 'qs';
import { request } from 'umi';
import { HOST } from './host';

// 获取所有地区信息
export async function demoAxios() {
  return request(`${HOST}/reduceEmission/area/all/tree`);
}

// 全省减污降碳指数评价
export async function fetchBrainCarbonIndex() {
  return request(`${HOST}/brain/bigScreen/home/assessment/carbonIndex/map`);
}

