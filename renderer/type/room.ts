import { Imessage } from "./message";
import { Iuser } from "./user";

export interface Iroom {
  title?: string;
  messages?: Imessage[];
  members?: Iuser[];
  created?: number;
  length?: number;
}
