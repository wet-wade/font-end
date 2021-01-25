export interface GroupMember {
  id: string;
  name: string;
}

export interface User extends GroupMember {
  username: string;
  phone: string;
}
