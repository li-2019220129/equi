const allRouter = [
    {
        path: '/',
        component: () => import('@/layout'),
        redirect: '/sysIndex',
        name: 'sysIndex',
        meta: {
            title: '首页',
            icon: 'item-home-icon',
            department: "sysIndex",
            role: 'person'
        },
        children: [{
            path: 'sysIndex',
            name: 'sysIndex',
            component: () => import('@/views/sysIndex/index'),
            meta: {
                title: '首页',
                icon: 'item-home-icon'
            }
        }, ]
    },
    {
        path: '/',
        component: () => import('@/layout'),
        redirect: '/sysIndex',
        name: 'sysIndex',
        meta: {
            title: '首页',
            icon: 'item-home-icon',
            department: "sysIndex",
            role: 'leader'
        },
        children: [{
            path: 'sysIndex',
            name: 'sysIndex',
            component: () => import('@/views/sysIndex/leader'),
            meta: {
                title: '首页',
                icon: 'item-home-icon'
            }
        }, ]
    },
    {
        path: '/task',
        component: () => import('@/layout'),
        redirect: '/task',
        name: 'task',
        meta: {
            title: '任务',
            icon: 'item-task-icon',
            department: "task"
        },
        children: [
          {
            path: 'index',
            name: 'task',
            component: () => import('@/views/task/index'),
            meta: {
                title: '任务',
                icon: 'item-task-icon'
            }
          },
        ]
    },
    // {
    //   path: '/task/newTask',
    //   component: () => import('@/layout'),
    //   redirect: '/task/newTask',
    //   name: 'task',
    //   meta: {
    //       title: '新建任务',
    //       icon: 'item-task-icon',
    //       department: "task"
    //   },
    //   children: [
    //     {
    //       path: 'newTask',
    //       name: 'task',
    //       component: () => import('@/views/task/new/index'),
    //       meta: {
    //           title: '新建',
    //           icon: 'item-task-icon'
    //       }
    //     },
    //   ]
    // }

    // {
    //     path: '/audit',
    //     component: () => import('@/layout'),
    //     redirect: '/audit',
    //     name: 'audit',
    //     meta: {
    //         title: '审批',
    //         icon: 'item-apply-icon',
    //         department: "audit"
    //     },
    //     children: [{
    //         path: 'index',
    //         name: 'audit',
    //         component: () => import('@/views/audit/index'),
    //         meta: {
    //             title: '审批',
    //             icon: 'item-apply-icon'
    //         }
    //     }, ]
    // },

    {
        path: '/',
        component: () => import('@/layout'),
        redirect: '/sysIndex',
        name: 'sysIndex',
        meta: {
            title: '工作计划',
            icon: 'item-work-icon',
            department: "sysIndex"
        },
        children: [{
            path: 'workPlane',
            name: 'WorkPlane',
            component: () => import('@/views/sysIndex/leader'),
            meta: {
                title: '工作计划',
                icon: 'item-work-icon'
            }
        }, ]
    },




    {
        path: '/analysis',
        component: () => import('@/layout'),
        redirect: '/analysis',
        name: 'analysis',
        meta: {
            title: '统计',
            icon: 'item-stat-icon',
            department: "analysis"
        },
        children: [{
            path: 'index',
            name: 'analysis',
            component: () => import('@/views/analysis/index'),
            meta: {
                title: '统计',
                icon: 'item-stat-icon'
            }
        }, ]
    },

    {
        path: '/',
        component: () => import('@/layout'),
        redirect: '/sysIndex',
        name: 'sysIndex',
        hidden:true,
        meta: {
            title: '刷新',
            icon: 'item-work-icon',
            department: "sysIndex"
        },
        children: [{
            path: 'other',
            name: 'other',
            component: () => import('@/views/redirect/index.vue'),
            meta: {
                title: '刷新',
                icon: 'item-work-icon'
            }
        }, ]
    },


    {
        path: '/redirect',
        redirect: '/other',
    },

    {
        path: '*',
        redirect: '/',
    },
]

export default allRouter
