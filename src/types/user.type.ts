export interface User {
  _id: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  admin: boolean;
  actor: boolean;
  group_name: string;
  team_name: string;
}
