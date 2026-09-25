module.exports = {
    privGroups :[
        {
            id: "USERS",
            name:"User Permission"
        },
        {
            id:"ROLES",
            name:"Role Permission"
        },
        {
            id:"CATEGORIES",
            name:"Category Permission"
        },
        {
            id:"AUDITLOGS",
            name:"AuditLogs Permission"
        }
    ],
    privilages:[
        {
            key:"user_view",
            name:"User View",
            group:"USERS",
            description:"User view"

        },
        {
            key:"user_add",
            name:"User Add",
            group:"USERS",
            description:"User add"
        },
        {
            key:"user_update",
            name:"User Update",
            group:"USERS",
            description:"User update"
        },
        {
            key:"user_delete",
            name:"User Delete",
            group:"USERS",
            description:"User delete"
        },
        {
            key:"role_view",
            name:"Role View",
            group:"ROLES",
            description:"Role view"

        },
        {
            key:"role_add",
            name:"Role Add",
            group:"ROLES",
            description:"Roles add"
        },
        {
            key:"role_update",
            name:"Role Update",
            group:"ROLES",
            description:"Roles update"
        },
        {
            key:"role_delete",
            name:"Role Delete",
            group:"ROLES",
            description:"Roles delete"
        },
        {
            key:"category_view",
            name:"Category View",
            group:"CATEGORIES",
            description:"Category view"

        },
        {
            key:"category_add",
            name:"Category Add",
            group:"CATEGORIES",
            description:"Category add"
        },
        {
            key:"category_update",
            name:"Category Update",
            group:"CATEGORIES",
            description:"Category update"
        },
        {
            key:"category_export",
            name:"Category Export",
            group:"CATEGORIES",
            description:"Category export"
        },
        {
            key:"category_delete",
            name:"Category Delete",
            group:"CATEGORIES",
            description:"Category delete"
        },
        {
            key:"auditlogs_view",
            name:"Auditlogs View",
            group:"AUDITLOGS",
            description:"Auditlogs view"

        }

    ]
}