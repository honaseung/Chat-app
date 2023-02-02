import {
  where,
  WhereFilterOp,
  QueryFieldFilterConstraint,
} from "firebase/firestore";

import { startAfter, QueryConstraint } from "firebase/database";

/**
 *
 * @param condition [찾을위치, 찾을조건, 찾을값, ...] 반드시 3의 배수개를 이용할것
 * @returns QueryFieldFilterConstraint[] 기본 데이터베이스 조회에 사용할 쿼리 조건 배열
 * @description "<" | "<=" | "==" | "!=" | ">=" | ">" | "array-contains" | "in" | "array-contains-any" | "not-in" 조건 사용가능
 * @deprecated 더이상 사용하지않습니다.
 */
export function useCreateWhere(
  condition: string[]
): QueryFieldFilterConstraint[] {
  const queryFieldFilterConstraints: QueryFieldFilterConstraint[] = [];
  while (condition.length > 0) {
    queryFieldFilterConstraints.push(
      where(
        condition.shift(),
        condition.shift() as WhereFilterOp,
        condition.shift()
      )
    );
  }
  return queryFieldFilterConstraints;
}

/**
 *
 * @param condition[] [찾을값, 찾을위치, 찾을값, 찾을위치 ...] 반드시 짝수개를 이용할것
 * @returns QueryConstraint[] 실시간 데이터베이스 조회에 사용할 쿼리 조건배열
 * @description 실시간 데이터베이스 조회시 'x' 의 값이 'y' 로 시작되는 조건을 return 해주는 함수 반드시
 * @deprecated 더이상 사용하지않습니다.
 */
export function useRealtimeDatabaseCreateWhere(
  condition: string[]
): QueryConstraint[] {
  const queryConstraints: QueryConstraint[] = [];
  while (condition.length > 0) {
    queryConstraints.push(startAfter(condition.shift(), condition.shift()));
  }
  return queryConstraints;
}
