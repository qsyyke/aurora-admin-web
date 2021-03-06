export const routeModel: Record<Auth.RoleType, AuthRoute.Route[]> = {
  super: [
    {
      name: 'dashboard',
      path: '/dashboard',
      component: 'basic',
      children: [
        {
          name: 'dashboard_analysis',
          path: '/dashboard/analysis',
          component: 'self',
          meta: {
            title: '分析页',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'dashboard_workbench',
          path: '/dashboard/workbench',
          component: 'self',
          meta: {
            title: '工作台',
            requiresAuth: true,
            icon: 'icon-park-outline:workbench'
          }
        }
      ],
      meta: {
        title: '仪表盘',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'document',
      path: '/document',
      component: 'basic',
      children: [
        {
          name: 'document_vue',
          path: '/document/vue',
          component: 'self',
          meta: {
            title: 'vue文档',
            requiresAuth: true,
            icon: 'mdi:vuejs'
          }
        },
        {
          name: 'document_vue-new',
          path: '/document/vue-new',
          component: 'self',
          meta: {
            title: 'vue文档(新版)',
            requiresAuth: true,
            icon: 'mdi:vuejs'
          }
        },
        {
          name: 'document_vite',
          path: '/document/vite',
          component: 'self',
          meta: {
            title: 'vite文档',
            requiresAuth: true,
            icon: 'simple-icons:vite'
          }
        },
        {
          name: 'document_project',
          path: '/document/project',
          meta: {
            title: '项目文档(外链)',
            requiresAuth: true,
            icon: 'mdi:file-link-outline',
            href: 'https://docs.soybean.pro/'
          }
        }
      ],
      meta: {
        title: '文档',
        icon: 'carbon:document',
        order: 2
      }
    },
    {
      name: 'monitor',
      path: '/monitor',
      component: 'basic',
      children: [
        {
          name: 'monitor_nacos',
          path: '/monitor/nacos',
          component: 'self',
          meta: {
            title: 'Nacos',
            requiresAuth: true,
            icon: 'mdi:vuejs'
          }
        },
        {
          name: 'monitor_sentinel',
          path: '/monitor/sentinel',
          component: 'self',
          meta: {
            title: 'Sentinel',
            requiresAuth: true,
            icon: 'mdi:vuejs'
          }
        },
        {
          name: 'monitor_rabbitmq',
          path: '/monitor/rabbitmq',
          component: 'self',
          meta: {
            title: 'Rabbitmq',
            requiresAuth: true,
            icon: 'simple-icons:vite'
          }
        },
        {
          name: 'monitor_seata',
          path: '/monitor/seata',
          component: 'self',
          meta: {
            title: 'Seata',
            requiresAuth: true,
            icon: 'simple-icons:vite'
          }
        }
      ],
      meta: {
        title: '监控',
        icon: 'carbon:document',
        order: 2
      }
    },
    {
      name: 'component',
      path: '/component',
      component: 'basic',
      children: [
        {
          name: 'component_button',
          path: '/component/button',
          component: 'self',
          meta: {
            title: '按钮',
            requiresAuth: true,
            icon: 'ic:baseline-radio-button-checked'
          }
        },
        {
          name: 'component_card',
          path: '/component/card',
          component: 'self',
          meta: {
            title: '卡片',
            requiresAuth: true,
            icon: 'mdi:card-outline'
          }
        },
        {
          name: 'component_table',
          path: '/component/table',
          component: 'self',
          meta: {
            title: '表格',
            requiresAuth: true,
            icon: 'mdi:table-large'
          }
        }
      ],
      meta: {
        title: '组件示例',
        icon: 'fluent:app-store-24-regular',
        order: 3
      }
    },
    {
      name: 'plugin',
      path: '/plugin',
      component: 'basic',
      children: [
        {
          name: 'plugin_map',
          path: '/plugin/map',
          component: 'self',
          meta: {
            title: '地图',
            requiresAuth: true,
            icon: 'mdi:map'
          }
        },
        {
          name: 'plugin_video',
          path: '/plugin/video',
          component: 'self',
          meta: {
            title: '视频',
            requiresAuth: true,
            icon: 'mdi:video'
          }
        },
        {
          name: 'plugin_editor',
          path: '/plugin/editor',
          component: 'multi',
          children: [
            {
              name: 'plugin_editor_quill',
              path: '/plugin/editor/quill',
              component: 'self',
              meta: {
                title: '富文本编辑器',
                requiresAuth: true,
                icon: 'mdi:file-document-edit-outline'
              }
            },
            {
              name: 'plugin_editor_markdown',
              path: '/plugin/editor/markdown',
              component: 'self',
              meta: {
                title: 'markdown编辑器',
                requiresAuth: true,
                icon: 'ri:markdown-line'
              }
            }
          ],
          meta: {
            title: '编辑器',
            icon: 'icon-park-outline:editor'
          }
        },
        {
          name: 'plugin_swiper',
          path: '/plugin/swiper',
          component: 'self',
          meta: {
            title: 'Swiper插件',
            requiresAuth: true,
            icon: 'simple-icons:swiper'
          }
        },
        {
          name: 'plugin_copy',
          path: '/plugin/copy',
          component: 'self',
          meta: {
            title: '剪贴板',
            requiresAuth: true,
            icon: 'mdi:clipboard-outline'
          }
        },
        {
          name: 'plugin_icon',
          path: '/plugin/icon',
          component: 'self',
          meta: {
            title: '图标',
            requiresAuth: true,
            icon: 'ic:baseline-insert-emoticon'
          }
        },
        {
          name: 'plugin_print',
          path: '/plugin/print',
          component: 'self',
          meta: {
            title: '打印',
            requiresAuth: true,
            icon: 'ic:baseline-local-printshop'
          }
        }
      ],
      meta: {
        title: '插件示例',
        icon: 'clarity:plugin-line',
        order: 4
      }
    },
    {
      name: 'auth-demo',
      path: '/auth-demo',
      component: 'basic',
      children: [
        {
          name: 'auth-demo_permission',
          path: '/auth-demo/permission',
          component: 'self',
          meta: {
            title: '权限切换',
            requiresAuth: true,
            icon: 'ic:round-construction'
          }
        },
        {
          name: 'auth-demo_super',
          path: '/auth-demo/super',
          component: 'self',
          meta: {
            title: '超级管理员可见',
            requiresAuth: true,
            icon: 'ic:round-supervisor-account'
          }
        }
      ],
      meta: {
        title: '权限示例',
        icon: 'ic:baseline-security',
        order: 5
      }
    },
    {
      name: 'exception',
      path: '/exception',
      component: 'basic',
      children: [
        {
          name: 'exception_403',
          path: '/exception/403',
          component: 'self',
          meta: {
            title: '异常页403',
            requiresAuth: true,
            icon: 'ic:baseline-block'
          }
        },
        {
          name: 'exception_404',
          path: '/exception/404',
          component: 'self',
          meta: {
            title: '异常页404',
            requiresAuth: true,
            icon: 'ic:baseline-web-asset-off'
          }
        },
        {
          name: 'exception_500',
          path: '/exception/500',
          component: 'self',
          meta: {
            title: '异常页500',
            requiresAuth: true,
            icon: 'ic:baseline-wifi-off'
          }
        }
      ],
      meta: {
        title: '异常页',
        icon: 'ant-design:exception-outlined',
        order: 6
      }
    },
    {
      name: 'multi-menu',
      path: '/multi-menu',
      component: 'basic',
      children: [
        {
          name: 'multi-menu_first',
          path: '/multi-menu/first',
          component: 'multi',
          children: [
            {
              name: 'multi-menu_first_second',
              path: '/multi-menu/first/second',
              component: 'self',
              meta: {
                title: '二级菜单',
                requiresAuth: true,
                icon: 'ic:outline-menu'
              }
            },
            {
              name: 'multi-menu_first_second-new',
              path: '/multi-menu/first/second-new',
              component: 'multi',
              children: [
                {
                  name: 'multi-menu_first_second-new_third',
                  path: '/multi-menu/first/second-new/third',
                  component: 'self',
                  meta: {
                    title: '三级菜单',
                    requiresAuth: true,
                    icon: 'ic:outline-menu'
                  }
                }
              ],
              meta: {
                title: '二级菜单(有子菜单)',
                icon: 'ic:outline-menu'
              }
            }
          ],
          meta: {
            title: '一级菜单',
            icon: 'ic:outline-menu'
          }
        }
      ],
      meta: {
        title: '多级菜单',
        icon: 'carbon:menu',
        order: 7
      }
    },
    {
      name: 'about',
      path: '/about',
      component: 'self',
      meta: {
        title: '关于',
        requiresAuth: true,
        singleLayout: 'basic',
        icon: 'fluent:book-information-24-regular',
        order: 8
      }
    },
    {
      name: 'users',
      path: '/users',
      component: 'basic',
      children: [
        {
          name: 'users_profile',
          path: '/users/profile',
          component: 'self',
          meta: {
            title: '个人信息',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'users_user',
          path: '/users/user',
          component: 'self',
          meta: {
            title: '用户管理',
            requiresAuth: true,
            icon: 'icon-park-outline:workbench'
          }
        }
      ],
      meta: {
        title: '用户中心',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'auth',
      path: '/auth',
      component: 'basic',
      children: [
        {
          name: 'auth_login',
          path: '/auth/login',
          component: 'self',
          meta: {
            title: '登录日志',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'auth_oauth-client',
          path: '/auth/oauth-client',
          component: 'self',
          meta: {
            title: '客户端秘钥',
            requiresAuth: true,
            icon: 'icon-park-outline:workbench'
          }
        }
      ],
      meta: {
        title: '认证中心',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'file',
      path: '/file',
      component: 'basic',
      children: [
        {
          name: 'file_picture',
          path: '/file/picture',
          component: 'self',
          meta: {
            title: '图片',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'file_other-file',
          path: '/file/other-file',
          component: 'self',
          meta: {
            title: '其他文件',
            requiresAuth: true,
            icon: 'icon-park-outline:workbench'
          }
        }
      ],
      meta: {
        title: '文件',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'comment',
      path: '/comment',
      component: 'basic',
      children: [
        {
          name: 'comment_show',
          path: '/comment/show',
          component: 'self',
          meta: {
            title: '展示',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        }
      ],
      meta: {
        title: '评论',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'article',
      path: '/article',
      component: 'basic',
      children: [
        {
          name: 'article_blog-article',
          path: '/article/blog-article',
          component: 'self',
          meta: {
            title: '博客文章管理',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'article_bulletin',
          path: '/article/bulletin',
          component: 'self',
          meta: {
            title: '公告',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'article_category',
          path: '/article/category',
          component: 'self',
          meta: {
            title: '类别',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'article_edit-article',
          path: '/article/edit-article',
          component: 'self',
          meta: {
            title: '发布',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'article_link',
          path: '/article/link',
          component: 'self',
          meta: {
            title: '友情链接',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'article_tag',
          path: '/article/tag',
          component: 'self',
          meta: {
            title: '分类',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'article_talk',
          path: '/article/talk',
          component: 'self',
          meta: {
            title: '说说',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        }
      ],
      meta: {
        title: '文章',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'message',
      path: '/message',
      component: 'basic',
      children: [
        {
          name: 'message_email',
          path: '/message/email',
          component: 'self',
          meta: {
            title: '邮箱管理',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'message_email-log',
          path: '/message/email-log',
          component: 'self',
          meta: {
            title: '邮件发送记录',
            requiresAuth: true,
            icon: 'icon-park-outline:workbench'
          }
        },
        {
          name: 'message_mail',
          path: '/message/mail',
          component: 'self',
          meta: {
            title: '发送邮件',
            requiresAuth: true,
            icon: 'icon-park-outline:workbench'
          }
        },
        {
          name: 'message_message-log',
          path: '/message/message-log',
          component: 'self',
          meta: {
            title: '消息中间件消息',
            requiresAuth: true,
            icon: 'icon-park-outline:workbench'
          }
        }
      ],
      meta: {
        title: '消息',
        icon: 'carbon:dashboard',
        order: 1
      }
    }
  ],
  admin: [
    {
      name: 'dashboard',
      path: '/dashboard',
      component: 'basic',
      children: [
        {
          name: 'dashboard_analysis',
          path: '/dashboard/analysis',
          component: 'self',
          meta: {
            title: '分析页',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        },
        {
          name: 'dashboard_workbench',
          path: '/dashboard/workbench',
          component: 'self',
          meta: {
            title: '工作台',
            requiresAuth: true,
            icon: 'icon-park-outline:workbench'
          }
        }
      ],
      meta: {
        title: '仪表盘',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'document',
      path: '/document',
      component: 'basic',
      children: [
        {
          name: 'document_vue',
          path: '/document/vue',
          component: 'self',
          meta: {
            title: 'vue文档',
            requiresAuth: true,
            icon: 'mdi:vuejs'
          }
        },
        {
          name: 'document_vue-new',
          path: '/document/vue-new',
          component: 'self',
          meta: {
            title: 'vue文档(新版)',
            requiresAuth: true,
            icon: 'mdi:vuejs'
          }
        },
        {
          name: 'document_vite',
          path: '/document/vite',
          component: 'self',
          meta: {
            title: 'vite文档',
            requiresAuth: true,
            icon: 'simple-icons:vite'
          }
        },
        {
          name: 'document_project',
          path: '/document/project',
          meta: {
            title: '项目文档(外链)',
            requiresAuth: true,
            icon: 'mdi:file-link-outline',
            href: 'https://docs.soybean.pro/'
          }
        }
      ],
      meta: {
        title: '文档',
        icon: 'carbon:document',
        order: 2
      }
    },
    {
      name: 'component',
      path: '/component',
      component: 'basic',
      children: [
        {
          name: 'component_button',
          path: '/component/button',
          component: 'self',
          meta: {
            title: '按钮',
            requiresAuth: true,
            icon: 'ic:baseline-radio-button-checked'
          }
        },
        {
          name: 'component_card',
          path: '/component/card',
          component: 'self',
          meta: {
            title: '卡片',
            requiresAuth: true,
            icon: 'mdi:card-outline'
          }
        },
        {
          name: 'component_table',
          path: '/component/table',
          component: 'self',
          meta: {
            title: '表格',
            requiresAuth: true,
            icon: 'mdi:table-large'
          }
        }
      ],
      meta: {
        title: '组件示例',
        icon: 'fluent:app-store-24-regular',
        order: 3
      }
    },
    {
      name: 'plugin',
      path: '/plugin',
      component: 'basic',
      children: [
        {
          name: 'plugin_map',
          path: '/plugin/map',
          component: 'self',
          meta: {
            title: '地图',
            requiresAuth: true,
            icon: 'mdi:map'
          }
        },
        {
          name: 'plugin_video',
          path: '/plugin/video',
          component: 'self',
          meta: {
            title: '视频',
            requiresAuth: true,
            icon: 'mdi:video'
          }
        },
        {
          name: 'plugin_editor',
          path: '/plugin/editor',
          component: 'multi',
          children: [
            {
              name: 'plugin_editor_quill',
              path: '/plugin/editor/quill',
              component: 'self',
              meta: {
                title: '富文本编辑器',
                requiresAuth: true,
                icon: 'mdi:file-document-edit-outline'
              }
            },
            {
              name: 'plugin_editor_markdown',
              path: '/plugin/editor/markdown',
              component: 'self',
              meta: {
                title: 'markdown编辑器',
                requiresAuth: true,
                icon: 'ri:markdown-line'
              }
            }
          ],
          meta: {
            title: '编辑器',
            icon: 'icon-park-outline:editor'
          }
        },
        {
          name: 'plugin_swiper',
          path: '/plugin/swiper',
          component: 'self',
          meta: {
            title: 'Swiper插件',
            requiresAuth: true,
            icon: 'simple-icons:swiper'
          }
        },
        {
          name: 'plugin_copy',
          path: '/plugin/copy',
          component: 'self',
          meta: {
            title: '剪贴板',
            requiresAuth: true,
            icon: 'mdi:clipboard-outline'
          }
        },
        {
          name: 'plugin_icon',
          path: '/plugin/icon',
          component: 'self',
          meta: {
            title: '图标',
            requiresAuth: true,
            icon: 'ic:baseline-insert-emoticon'
          }
        },
        {
          name: 'plugin_print',
          path: '/plugin/print',
          component: 'self',
          meta: {
            title: '打印',
            requiresAuth: true,
            icon: 'ic:baseline-local-printshop'
          }
        }
      ],
      meta: {
        title: '插件示例',
        icon: 'clarity:plugin-line',
        order: 4
      }
    },
    {
      name: 'auth-demo',
      path: '/auth-demo',
      component: 'basic',
      children: [
        {
          name: 'auth-demo_permission',
          path: '/auth-demo/permission',
          component: 'self',
          meta: {
            title: '权限切换',
            requiresAuth: true,
            icon: 'ic:round-construction'
          }
        }
      ],
      meta: {
        title: '权限示例',
        icon: 'ic:baseline-security',
        order: 5
      }
    },
    {
      name: 'exception',
      path: '/exception',
      component: 'basic',
      children: [
        {
          name: 'exception_403',
          path: '/exception/403',
          component: 'self',
          meta: {
            title: '异常页403',
            requiresAuth: true,
            icon: 'ic:baseline-block'
          }
        },
        {
          name: 'exception_404',
          path: '/exception/404',
          component: 'self',
          meta: {
            title: '异常页404',
            requiresAuth: true,
            icon: 'ic:baseline-web-asset-off'
          }
        },
        {
          name: 'exception_500',
          path: '/exception/500',
          component: 'self',
          meta: {
            title: '异常页500',
            requiresAuth: true,
            icon: 'ic:baseline-wifi-off'
          }
        }
      ],
      meta: {
        title: '异常页',
        icon: 'ant-design:exception-outlined',
        order: 6
      }
    },
    {
      name: 'multi-menu',
      path: '/multi-menu',
      component: 'basic',
      children: [
        {
          name: 'multi-menu_first',
          path: '/multi-menu/first',
          component: 'multi',
          children: [
            {
              name: 'multi-menu_first_second',
              path: '/multi-menu/first/second',
              component: 'self',
              meta: {
                title: '二级菜单',
                requiresAuth: true,
                icon: 'ic:outline-menu'
              }
            },
            {
              name: 'multi-menu_first_second-new',
              path: '/multi-menu/first/second-new',
              component: 'multi',
              children: [
                {
                  name: 'multi-menu_first_second-new_third',
                  path: '/multi-menu/first/second-new/third',
                  component: 'self',
                  meta: {
                    title: '三级菜单',
                    requiresAuth: true,
                    icon: 'ic:outline-menu'
                  }
                }
              ],
              meta: {
                title: '二级菜单(有子菜单)',
                icon: 'ic:outline-menu'
              }
            }
          ],
          meta: {
            title: '一级菜单',
            icon: 'ic:outline-menu'
          }
        }
      ],
      meta: {
        title: '多级菜单',
        icon: 'carbon:menu',
        order: 7
      }
    },
    {
      name: 'about',
      path: '/about',
      component: 'self',
      meta: {
        title: '关于',
        requiresAuth: true,
        singleLayout: 'basic',
        icon: 'fluent:book-information-24-regular',
        order: 8
      }
    }
  ],
  user: [
    {
      name: 'dashboard',
      path: '/dashboard',
      component: 'basic',
      children: [
        {
          name: 'dashboard_analysis',
          path: '/dashboard/analysis',
          component: 'self',
          meta: {
            title: '分析页',
            requiresAuth: true,
            icon: 'icon-park-outline:analysis'
          }
        }
      ],
      meta: {
        title: '仪表盘',
        icon: 'carbon:dashboard',
        order: 1
      }
    },
    {
      name: 'auth-demo',
      path: '/auth-demo',
      component: 'basic',
      children: [
        {
          name: 'auth-demo_permission',
          path: '/auth-demo/permission',
          component: 'self',
          meta: {
            title: '权限切换',
            requiresAuth: true,
            icon: 'ic:round-construction'
          }
        }
      ],
      meta: {
        title: '权限示例',
        icon: 'ic:baseline-security',
        order: 5
      }
    },
    {
      name: 'multi-menu',
      path: '/multi-menu',
      component: 'basic',
      children: [
        {
          name: 'multi-menu_first',
          path: '/multi-menu/first',
          component: 'multi',
          children: [
            {
              name: 'multi-menu_first_second',
              path: '/multi-menu/first/second',
              component: 'self',
              meta: {
                title: '二级菜单',
                requiresAuth: true,
                icon: 'ic:outline-menu'
              }
            },
            {
              name: 'multi-menu_first_second-new',
              path: '/multi-menu/first/second-new',
              component: 'multi',
              children: [
                {
                  name: 'multi-menu_first_second-new_third',
                  path: '/multi-menu/first/second-new/third',
                  component: 'self',
                  meta: {
                    title: '三级菜单',
                    requiresAuth: true,
                    icon: 'ic:outline-menu'
                  }
                }
              ],
              meta: {
                title: '二级菜单(有子菜单)',
                icon: 'ic:outline-menu'
              }
            }
          ],
          meta: {
            title: '一级菜单',
            icon: 'ic:outline-menu'
          }
        }
      ],
      meta: {
        title: '多级菜单',
        icon: 'carbon:menu',
        order: 7
      }
    },
    {
      name: 'about',
      path: '/about',
      component: 'self',
      meta: {
        title: '关于',
        requiresAuth: true,
        singleLayout: 'basic',
        icon: 'fluent:book-information-24-regular',
        order: 8
      }
    }
  ]
};
