/**
 * @description api 용 요청 객체를 생성해주는 함수입니다.
 * @deprecated 더이상 사용하지 않습니다.
 */
export default function useCreateRequest(
  databaseType: database,
  actionType: action,
  collectionType: collection,
  inputParams: object,
  condition: string[],
  sucCallback: void,
  failCallback: void
) {
  const request: Irequest = {
    databaseType,
    actionType,
    collectionType,
    inputParams,
    condition,
  };
  return [request, sucCallback, failCallback];
}

/**
 * @deprecated
 */
interface Irequest {
  databaseType: database;
  actionType: action;
  collectionType: collection;
  inputParams: object;
  condition: string[];
}

/**
 * @description
 * C: 일반 파이어스토어
 * R: 실시간 데이터베이스
 * U: 유저 정보
 * @deprecated
 */
declare type database = "C" | "R" | "U";

/**
 * @description
 * set: 데이터 추가 및 업데이트 또는 삭제
 * get: 데이터 읽기
 * out: 로그 아웃
 * @deprecated
 */
declare type action = "set" | "get" | "out";

/**
 * @description
 * test: 데이터베이스 연결 테스트용 컬렉션
 * users: 유저 정보 컬렉션
 * @deprecated
 */
declare type collection = "test" | "users" | "";
