import { Iuser } from "./user";

/**
 * @description 파이어베이스 API 용 요청 객체
 */
export interface Irequest {
  collectionType?: string;
  inputParams?: Iuser;
  condition?: string[];
}

/**
 * @description 파이어베이스 API 용 콜백 함수
 */
export type Icallback = Function;
