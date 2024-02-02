import { User } from './user.type.ts';

interface Task {
}

export default interface Scene {
    title: string;
    orderNumber: number;
    description: string;
    tasks: Task[];
    teams: User[];
}