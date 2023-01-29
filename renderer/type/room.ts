import { Iuser } from "./user";

export interface Iroom {
  title?: string;
  messages?: { [x: string]: string };
  members?: object;
  changedId?: string;
}
