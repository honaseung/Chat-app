/**
 * @description 채팅방 메세지 타입
 */
export interface Imessage {
  userId?: string;
  userName?: string;
  prevDate?: number;
  date?: number;
  text?: string;
}

export interface IdetailMessage {}
