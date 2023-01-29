export interface Iuser {
  email: string;
  phoneNumber: string;
  displayName?: string;
  id: string;
  password: string;
}

export const defaultUser: Iuser = {
  email: "",
  phoneNumber: "",
  displayName: "",
  id: "",
  password: "",
};
