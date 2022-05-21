export interface IUser {
    id?: number;
    name: string;
    username: string;
    email: string;
    roleIDs: number[];
    password: string;
    companyIDs: number[];
}

interface IPermission {
    id?: number;
    name: string;
    description?: string;
}

export interface IRole {
    id?: number;
    name: string;
    permissionIDs: IPermission[];
}

// example of a Role
export const Admin : IRole = {
    id: 1,
    name: 'Admin',
    permissionIDs: [
        {
            id: 1,
            name: "create"
        },
        {
            id: 2,
            name: "read"
        },
        {
            id: 3,
            name: "update"
        },
        {
            id: 4,
            name: "delete"
        }
    ]
}



// Ref : User.companyID > Company.id