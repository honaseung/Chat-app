/**
 *
 * @param target 복사할 대상
 * @returns 복사된 대상
 * @description 객체를 deepCopy 하는 재귀호출 함수입니다.
 */
export function deepCopy(target: object) {
  const clone: object = {};
  for (const key in target) {
    if (target[key] && typeof target[key] === "object") {
      clone[key] = deepCopy(target[key]);
    } else {
      clone[key] = target[key];
    }
  }
  return clone;
}
