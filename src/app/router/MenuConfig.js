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
        icon: "flaticon2-architecture-and-city",
        page: "",
        translate: "MENU.GRAIN",
        submenu: [
          {
            title: "Объявления на продажу",
            page: "",
            translate: "SUBMENU.BIDS.SALE",
            submenu: [
              {
                title: "Лучшие объявления",
                page: "",
                translate: "SUBMENU.BIDS.BEST",
                bullet: "dot",
                submenu:
                  crops &&
                  crops.map &&
                  crops.map(crop => ({
                    title: crop.name,
                    page: `sale/best-bids/${crop.id}`,
                  })),
              },
              {
                title: "Мои объявления",
                page: "sale/my-bids",
                translate: "SUBMENU.MY_BIDS",
              },
              {
                title: "Все объявления",
                page: "",
                translate: "SUBMENU.ALL_BIDS",
                // bullet: "dot",
                submenu:
                  crops &&
                  crops.map &&
                  crops.map(crop => ({
                    title: crop.name,
                    page: `sale/all-bids/${crop.id}`,
                  })),
              },
            ],
          },
          {
            title: "Объявления на покупку",
            page: "",
            translate: "SUBMENU.BIDS.PURCHASE",
            submenu: [
              {
                title: "Лучшие объявления",
                page: "",
                translate: "SUBMENU.BIDS.BEST",
                bullet: "dot",
                submenu:
                  crops &&
                  crops.map &&
                  crops.map(crop => ({
                    title: crop.name,
                    page: `purchase/best-bids/${crop.id}`,
                  })),
              },
              {
                title: "Мои объявления",
                page: "purchase/my-bids",
                translate: "SUBMENU.MY_BIDS",
              },
              {
                title: "Все объявления",
                page: "",
                translate: "SUBMENU.ALL_BIDS",
                bullet: "dot",
                submenu:
                  crops &&
                  crops.map &&
                  crops.map(crop => ({
                    title: crop.name,
                    page: `purchase/all-bids/${crop.id}`,
                  })),
              },
            ],
          },
          {
            title: "Сделки",
            page: "deals",
            translate: "SUBMENU.BIDS.DEALS",
          },
        ],
      },
      {
        title: "Аналитика",
        icon: "flaticon2-graphic-1",
        page: "builder",
        translate: "MENU.ANALITICS",
        submenu: [
          {
            title: "Отчёт по активности",
            page: "activity-report",
            translate: "SUBMENU.ACTIVITY_REPORT",
          },
        ],
      },
      {
        title: "Пользователи",
        icon: "flaticon2-avatar",
        page: "builder",
        translate: "MENU.USERS",
        submenu: [
          {
            title: "Список пользователей",
            page: "user-list",
            translate: "SUBMENU.USER.LIST",
          },
          {
            title: "Добавить пользователя",
            page: "user/create",
            translate: "SUBMENU.USER.CREATE_USER",
          },
          {
            title: "Список компаний",
            page: "companyList",
            translate: "SUBMENU.COMPANY.LIST",
          },
          {
            title: "Добавить компанию",
            page: "company/create",
            translate: "SUBMENU.COMPANY.CREATE",
          },
        ],
      },
      {
        title: "Настройки",
        icon: "flaticon2-settings",
        page: "builder",
        translate: "MENU.SETTINGS",
        submenu: [
          {
            title: "Мой профайл",
            page: "user/profile",
            translate: "SUBMENU.PROFILE",
          },
          {
            title: "Мои фильтры",
            page: "",
            translate: "SUBMENU.MY_FILTERS",
            submenu: [
              {
                title: "Фильтры на продажу",
                page: "sale/filters",
                translate: "SUBMENU.BUYER_FILTERS",
              },
              {
                title: "Фильтры на покупку",
                page: "purchase/filters",
                translate: "SUBMENU.SELLER_FILTERS",
              },
            ],
          },
          {
            title: "Настройки каталога",
            page: "",
            translate: "SUBMENU.CATALOG.SETTINGS",
            submenu: [
              {
                title: "Список культур",
                page: "cropList",
                translate: "SUBMENU.CATALOG.CROP_LIST",
              },
              {
                title: "Добавить культуру",
                page: "crop/create",
                translate: "SUBMENU.CATALOG.CREATE_CROP",
              },
            ],
          },
          {
            title: "Настройка воронки",
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
        icon: "flaticon2-document",
        page: "builder",
        translate: "MENU.DOCS",
        submenu: [
          {
            title: "Пользовательское соглашение",
            page: "userDocs/legacy",
            translate: "SUBMENU.LEGAL",
          },
        ],
      },
      {
        title: "Выход",
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
        icon: "flaticon2-architecture-and-city",
        page: "",
        translate: "MENU.GRAIN",
        submenu: [
          {
            title: "Лучшие объявления",
            page: "",
            translate: "SUBMENU.BIDS.BEST",
            bullet: "dot",
            submenu: crops.map(crop => ({
              title: crop.name,
              page: `purchase/best-bids/${crop.id}`,
            })),
          },
          {
            title: "Добавить объявление",
            page: "bid/create/sale/0/0",
            translate: "SUBMENU.GRAIN.CREATE_AD",
          },
          {
            title: "Мои объявления",
            page: "sale/my-bids",
            translate: "SUBMENU.MY_BIDS",
          },
        ],
      },
      {
        title: "Настройки",
        icon: "flaticon2-settings",
        page: "builder",
        translate: "MENU.SETTINGS",
        submenu: [
          {
            title: "Мой профайл",
            page: "user/profile",
            translate: "SUBMENU.PROFILE",
          },
          {
            title: "Мои фильтры",
            page: "purchase/filters",
            translate: "SUBMENU.MY_FILTERS",
          },
        ],
      },
      {
        title: "Выход",
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
        icon: "flaticon2-architecture-and-city",
        page: "",
        translate: "MENU.GRAIN",
        submenu: [
          {
            title: "Лучшие объявления",
            page: "",
            translate: "SUBMENU.BIDS.BEST",
            bullet: "dot",
            submenu: crops.map(crop => ({
              title: crop.name,
              page: `sale/best-bids/${crop.id}`,
            })),
          },
          {
            title: "Добавить объявление",
            page: "bid/create/purchase/0/0",
            translate: "SUBMENU.GRAIN.CREATE_AD",
          },
          {
            title: "Мои объявления",
            page: "purchase/my-bids",
            translate: "SUBMENU.MY_BIDS",
          },
        ],
      },
      {
        title: "Настройки",
        icon: "flaticon2-settings",
        page: "builder",
        translate: "MENU.SETTINGS",
        submenu: [
          {
            title: "Мой профайл",
            page: "user/profile",
            translate: "SUBMENU.PROFILE",
          },
          {
            title: "Мои фильтры",
            page: "sale/filters",
            translate: "SUBMENU.MY_FILTERS",
          },
        ],
      },
      {
        title: "Выход",
        icon: "flaticon-logout",
        page: "logout",
        translate: "MENU.LOGOUT",
      },
    ],
  },
});
