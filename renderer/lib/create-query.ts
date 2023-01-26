import {
  where,
  WhereFilterOp,
  QueryFieldFilterConstraint,
} from "firebase/firestore";

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
