export interface User {
    name: string;
    accessToken: string;
    refreshToken: string;
    admin: boolean;
    actor: boolean;
    group_name: string;
    team_name: string;
}