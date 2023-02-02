import { Imessage } from "./message";
import { Iuser } from "./user";

/**
 * 채팅방 타입
 */
export interface Iroom {
  title?: string;
  messages?: Imessage[];
  members?: Iuser[];
  created?: number;
  length?: number;
  img?: string;
}
