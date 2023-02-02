//@ts-nocheck
/**
 * @param target 복사할 대상
 * @returns 복사된 대상
 * @description 객체를 deepCopy 하는 재귀호출 함수입니다.
 * @deprecated
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

/**
 *
 * @param original 특수문자를 변경할 대상
 * @returns 특수문자가 변경된 대상
 * @description 특수문자 전부를 변경 합니다.
 */
export function replaceAllSpecialChar(
  original: string = "",
  replace: string = ""
) {
  return original.replaceAll(
    /[\{\}\[\]\/?.,;:|\)*~`!^_+<>@\#$%&\\\=\(\'\"]/g,
    replace
  );
}

/**
 *
 * @param yourId 초대를 하는 당사자의 ID
 * @param targetId 초대를 받는 상대방의 ID
 * @returns 당사자와 상대방의 ID 를 순차정렬한 뒤 하나의 문자열로 반환합니다.
 */
export function createChatRoomCollection(targetIds: string[]) {
  let roomTitle = "";
  targetIds.forEach((id) => (roomTitle += `-${id}`));
  return replaceAllSpecialChar(roomTitle, "_");
}

export function createLocaleDateString(target: number) {
  return new Date(parseInt(target, 10)).toLocaleDateString();
}

export function toEllipsis(target: string, cutLength: number) {
  return target.length > cutLength
    ? target.slice(0, cutLength) + "..."
    : target;
}
