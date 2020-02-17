export default function (crops){
    return {
        header: {
            self: {},
            items: [
            ]
          },
          aside: {
            self: {},
            items: [
              {
                title: "Рынок зерна",
                root: true,
                icon: "flaticon2-architecture-and-city",
                page: "dashboard",
                translate: "MENU.GRAIN",  
                submenu: [
                  {
                    title: "Заявки на продажу",
                    root: true,
                    page: "",
                    translate: "SUBMENU.ADS",
                    bullet: "dot",
                    submenu: crops.map(crop => (  {
                      title: crop.name,
                      root: true,
                      page: "bidsList",
                      translate: crop.name
                    })),
                  },
                  {
                    title: "Добавить заявку",
                    root: true,
                    page: "bid/create",
                    translate: "SUBMENU.GRAIN.CREATE_AD",
                  }
                ]
              },
              {
                title: "Пользователи",
                root: true,
                icon: "flaticon2-avatar",
                page: "builder",
                translate: "MENU.USERS",
                submenu: [
                  {
                    title: "Список пользователей",
                    root: true,
                    page: "userList",
                    translate: "SUBMENU.USER.LIST",
                  },
                  {
                    title: "Добавить пользователя",
                    root: true,
                    page: "user/create",
                    translate: "SUBMENU.USER.CREATE_USER",
                  }
                ]
              },
              {
                title: "Настройки",
                root: true,
                icon: "flaticon2-settings",
                page: "builder",
                translate: "MENU.SETTINGS",
                submenu: [
                  {
                    title: "Мой профайл",
                    root: true,
                    page: "user/profile",
                    translate: "SUBMENU.PROFILE",
                  },
                  {
                    title: "Настройки каталога",
                    root: true,
                    page: "",
                    translate: "SUBMENU.CATALOG.SETTINGS",
                  },
                  {
                    title: "Настройки системы",
                    root: true,
                    page: "",
                    translate: "SUBMENU.SYSTEM.SETTINGS",
                  }
                ]
              },
              {
                title: "Документы",
                root: true,
                icon: "flaticon2-document",
                page: "builder",
                translate: "MENU.DOCS",
                submenu: [
                  {
                    title: "Пользовательское соглашение",
                    root: true,
                    page: "userDocs/legacy",
                    translate: "SUBMENU.LEGAL",
                  }
                ]
              },
              {
                title: "Выход",
                root: true,
                icon: "flaticon-logout",
                page: "logout",
                translate: "MENU.LOGOUT",
              },
            ]
          }
    }
} ;

