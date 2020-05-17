export default function getMenuConfig(crops = [], user) {
  if (user.is_admin) {
    return getAdminMenu(crops);
  }
  if (user.is_vendor) {
    return getVendorMenu(crops);
  }
  return getBuyerMenu(crops);
}

const getAdminMenu = crops => ({
  header: {
    self: {},
    items: [],
  },
  aside: {
    self: {},
    items: [
      {
        title: "Рынок зерна",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "",
        translate: "MENU.GRAIN",
        submenu: [
          {
            title: "Заявки на продажу",
            root: true,
            page: "",
            translate: "SUBMENU.BIDS.SALE",
            submenu: [
              {
                title: "Лучшие заявки",
                root: true,
                page: "",
                translate: "SUBMENU.BIDS.BEST",
                bullet: "dot",
                submenu:
                  crops &&
                  crops.map &&
                  crops.map(crop => ({
                    title: crop.name,
                    root: true,
                    page: `sale/best-bids/${crop.id}`,
                  })),
              },
              {
                title: "Мои заявки",
                root: true,
                page: "sale/my-bids",
                translate: "SUBMENU.MY_BIDS",
              },
              {
                title: "Все заявки",
                root: true,
                page: "",
                translate: "SUBMENU.ALL_BIDS",
                bullet: "dot",
                submenu:
                  crops &&
                  crops.map &&
                  crops.map(crop => ({
                    title: crop.name,
                    root: true,
                    page: `sale/all-bids/${crop.id}`,
                  })),
              },
            ],
          },
          {
            title: "Заявки на покупку",
            root: true,
            page: "",
            translate: "SUBMENU.BIDS.PURCHASE",
            submenu: [
              {
                title: "Лучшие заявки",
                root: true,
                page: "",
                translate: "SUBMENU.BIDS.BEST",
                bullet: "dot",
                submenu:
                  crops &&
                  crops.map &&
                  crops.map(crop => ({
                    title: crop.name,
                    root: true,
                    page: `purchase/best-bids/${crop.id}`,
                  })),
              },
              {
                title: "Мои заявки",
                root: true,
                page: "purchase/my-bids",
                translate: "SUBMENU.MY_BIDS",
              },
              {
                title: "Все заявки",
                root: true,
                page: "",
                translate: "SUBMENU.ALL_BIDS",
                bullet: "dot",
                submenu:
                  crops &&
                  crops.map &&
                  crops.map(crop => ({
                    title: crop.name,
                    root: true,
                    page: `purchase/all-bids/${crop.id}`,
                  })),
              },
            ],
          },
          {
            title: "Сделки",
            root: true,
            page: "deals",
            translate: "SUBMENU.BIDS.DEALS",
          },
        ],
      },
      {
        title: "Аналитика",
        root: true,
        icon: "flaticon2-graphic-1",
        page: "builder",
        translate: "MENU.ANALITICS",
        submenu: [
          {
            title: "Отчёт по активности",
            root: true,
            page: "activity-report",
            translate: "SUBMENU.ACTIVITY_REPORT",
          },
        ],
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
            page: "user-list",
            translate: "SUBMENU.USER.LIST",
          },
          {
            title: "Добавить пользователя",
            root: true,
            page: "user/create",
            translate: "SUBMENU.USER.CREATE_USER",
          },
          {
            title: "Список компаний",
            root: true,
            page: "companyList",
            translate: "SUBMENU.COMPANY.LIST",
          },
          {
            title: "Добавить компанию",
            root: true,
            page: "company/create",
            translate: "SUBMENU.COMPANY.CREATE",
          },
        ],
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
            title: "Мои фильтры",
            root: true,
            page: "",
            translate: "SUBMENU.MY_FILTERS",
            submenu: [
              {
                title: "Фильтры на продажу",
                root: true,
                page: "sale/filters",
                translate: "SUBMENU.BUYER_FILTERS",
              },
              {
                title: "Фильтры на покупку",
                root: true,
                page: "purchase/filters",
                translate: "SUBMENU.SELLER_FILTERS",
              },
            ],
          },
          {
            title: "Настройки каталога",
            root: true,
            page: "",
            translate: "SUBMENU.CATALOG.SETTINGS",
            submenu: [
              {
                title: "Список культур",
                root: true,
                page: "cropList",
                translate: "SUBMENU.CATALOG.CROP_LIST",
              },
              {
                title: "Добавить культуру",
                root: true,
                page: "crop/create",
                translate: "SUBMENU.CATALOG.CREATE_CROP",
              },
            ],
          },
          {
            title: "Настройка воронки",
            root: true,
            page: "funnel-states",
            translate: "SUBMENU.FUNNEL_STATES",
          },
          // {
          //   title: "Настройки системы",
          //   root: true,
          //   page: "",
          //   translate: "SUBMENU.SYSTEM.SETTINGS",
          // },
        ],
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
          },
        ],
      },
      {
        title: "Выход",
        root: true,
        icon: "flaticon-logout",
        page: "logout",
        translate: "MENU.LOGOUT",
      },
    ],
  },
});

const getVendorMenu = crops => ({
  header: {
    self: {},
    items: [],
  },
  aside: {
    self: {},
    items: [
      {
        title: "Рынок зерна",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "",
        translate: "MENU.GRAIN",
        submenu: [
          {
            title: "Лучшие заявки",
            root: true,
            page: "",
            translate: "SUBMENU.BIDS.BEST",
            bullet: "dot",
            submenu: crops.map(crop => ({
              title: crop.name,
              root: true,
              page: `purchase/best-bids/${crop.id}`,
              //translate: crop.name,
            })),
          },
          {
            title: "Добавить заявку",
            root: true,
            page: "bid/create/sale/0/0",
            translate: "SUBMENU.GRAIN.CREATE_AD",
          },
          {
            title: "Мои заявки",
            root: true,
            page: "sale/my-bids",
            translate: "SUBMENU.MY_BIDS",
          },
        ],
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
            title: "Мои фильтры",
            root: true,
            page: "purchase/filters",
            translate: "SUBMENU.MY_FILTERS",
          },
        ],
      },
      {
        title: "Выход",
        root: true,
        icon: "flaticon-logout",
        page: "logout",
        translate: "MENU.LOGOUT",
      },
    ],
  },
});

const getBuyerMenu = crops => ({
  header: {
    self: {},
    items: [],
  },
  aside: {
    self: {},
    items: [
      {
        title: "Рынок зерна",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "",
        translate: "MENU.GRAIN",
        submenu: [
          {
            title: "Лучшие заявки",
            root: true,
            page: "",
            translate: "SUBMENU.BIDS.BEST",
            bullet: "dot",
            submenu: crops.map(crop => ({
              title: crop.name,
              root: true,
              page: `sale/best-bids/${crop.id}`,
              //translate: crop.name,
            })),
          },
          {
            title: "Добавить заявку",
            root: true,
            page: "bid/create/purchase/0/0",
            translate: "SUBMENU.GRAIN.CREATE_AD",
          },
          {
            title: "Мои заявки",
            root: true,
            page: "purchase/my-bids",
            translate: "SUBMENU.MY_BIDS",
          },
        ],
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
            title: "Мои фильтры",
            root: true,
            page: "sale/filters",
            translate: "SUBMENU.MY_FILTERS",
          },
        ],
      },
      {
        title: "Выход",
        root: true,
        icon: "flaticon-logout",
        page: "logout",
        translate: "MENU.LOGOUT",
      },
    ],
  },
});
