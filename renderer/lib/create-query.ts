import {
  where,
  WhereFilterOp,
  QueryFieldFilterConstraint,
} from "firebase/firestore";

import { startAfter, QueryConstraint } from "firebase/database";

export function useCreateWhere(condition: string[]) {
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

export function useRealtimeDatabaseCreateWhere(condition: string[]) {
  const queryConstraints: QueryConstraint[] = [];
  while (condition.length > 0) {
    queryConstraints.push(startAfter(condition.shift(), condition.shift()));
  }
  return queryConstraints;
}
