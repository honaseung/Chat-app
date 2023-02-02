/**
 * @param target 복사할 대상
 * @returns 복사된 대상
 * @description 객체를 deepCopy 하는 재귀호출 함수입니다.
 * @deprecated value 가 string 일시 비정상 작동하는 경우가 있습니다.
 */
export function deepCopy(target: object): object {
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
): string {
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
 * @deprecated DB 구조가 변경되었습니다.
 */
export function createChatRoomCollection(targetIds: string[]): string {
  let roomTitle = "";
  targetIds.forEach((id) => (roomTitle += `-${id}`));
  return replaceAllSpecialChar(roomTitle, "_");
}

/**
 *
 * @param milliseconds 날짜를 얻고 싶은 밀리세컨드입니다.
 * @returns 날짜 문자열을 리턴합니다.
 * @description 밀리세컨드로 날짜를 구하는 함수입니다. 시간은 고려하지않습니다.
 */
export function createLocaleDateString(milliseconds: number): string {
  return new Date(milliseconds).toLocaleDateString();
}

/**
 *
 * @param target 생략하고 싶은 문자열입니다.
 * @param cutLength 표현하고 싶은 길이입니다. 만약 5 를 넣는다면 4 까지만 표현됩니다.
 * @returns 표현하고 싶은 길이 이후에는 '...' 으로 생략 표현된 문자열을 리턴합니다.
 * @description 문자열을 가지고 자르고 생략 기호를 붙여서 새로운 문자열을 만드는 함수입니다.
 */
export function toEllipsis(target: string, cutLength: number): string {
  return target.length > cutLength
    ? target.slice(0, cutLength) + "..."
    : target;
}
