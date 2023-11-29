/**
 * 校验非空
 * @param {*} val
 * @return boolean
 */
export function notEmpty(val) {
  if (!notNull(val)) {
    return false;
  }
  if (getRawType(val) === "array") {
    return val.length;
  }
  if (getRawType(val) === "object") {
    return !!Object.keys(val).length;
  }
  return true;
}

export function notNull(val) {
  return val !== undefined && val !== null;
}

/**
 * @description 返回数据原始类型
 * @param value
 * @return { string } type
 */
export function getRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * @description  取消响应式 
 * @param val
 * */
export function unObserver(val) {
  if (getRawType(val) === "object" || getRawType(val) === "array") {
    val.__v_skip = true;
    return val;
  }
  return val;
}
