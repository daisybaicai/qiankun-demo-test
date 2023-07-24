
export const isNum = (value) => typeof value === 'number';

export const getNumVal = (value, defalutValue = 0) => {
  if (typeof value === 'number') return value;
  return defalutValue;
}

export const isArray = (value) => Array.isArray(value);

export const isEmptyArray = (value) => isArray(value) && !value.length;

export const isEmpty = (value) => {
  if (isArray(value)) return !value.length;
  if (typeof value === 'object') {
    if (value === null) return true;
    return !Object.keys(value).length;
  }
}