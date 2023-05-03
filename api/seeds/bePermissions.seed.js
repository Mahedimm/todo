const {PermissionModel} = require("../models/bePermission.model");

setTimeout(async () => {
    const arr = [
        { name: 'dashboard_index', displayName: 'Dashboard View', group: 'Dashboard' },

        { name: 'um_departments_index', displayName: 'Departments View', group: 'User Management - Departments' },
        { name: 'um_departments_create', displayName: 'Departments Create', group: 'User Management - Departments' },
        { name: 'um_departments_update', displayName: 'Departments Update', group: 'User Management - Departments' },
        { name: 'um_departments_delete', displayName: 'Departments Delete', group: 'User Management - Departments' },

        { name: 'um_teams_index', displayName: 'Teams View', group: 'User Management - Teams' },
        { name: 'um_teams_create', displayName: 'Teams Create', group: 'User Management - Teams' },
        { name: 'um_teams_update', displayName: 'Teams Update', group: 'User Management - Teams' },
        { name: 'um_teams_delete', displayName: 'Teams Delete', group: 'User Management - Teams' },

        { name: 'um_roles_index', displayName: 'Roles View', group: 'User Management - Roles' },
        { name: 'um_roles_create', displayName: 'Roles Create', group: 'User Management - Roles' },
        { name: 'um_roles_update', displayName: 'Roles Update', group: 'User Management - Roles' },
        { name: 'um_roles_delete', displayName: 'Roles Delete', group: 'User Management - Roles' },

        { name: 'um_roles_permissions_index', displayName: 'Roles Permissions View', group: 'User Management - Roles Permissions' },
        { name: 'um_roles_permissions_update', displayName: 'Roles Permissions Update', group: 'User Management - Roles Permissions' },

        { name: 'um_users_index', displayName: 'Users View', group: 'User Management - Users' },
        { name: 'um_users_create', displayName: 'Users Create', group: 'User Management - Users' },
        { name: 'um_users_update', displayName: 'Users Update', group: 'User Management - Users' },
        { name: 'um_users_delete', displayName: 'Users Delete', group: 'User Management - Users' },
    ];

    await PermissionModel.deleteMany({});
    await PermissionModel.insertMany(arr, (error, docs) => {
        if (error)
            console.log(error)
    });
}, 1100);
