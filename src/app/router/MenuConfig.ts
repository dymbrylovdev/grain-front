import { ICrop } from "../interfaces/crops";
import { IUser } from "../interfaces/users";

export default function getMenuConfig(crops: ICrop[] = [], user: IUser) {
  if (user?.roles?.length) {
    const role = user.roles[0];
    switch (role) {
      case "ROLE_ADMIN":
        return getAdminMenu(crops);
      case "ROLE_MANAGER":
        return getManagerMenu(crops);
      case "ROLE_BUYER":
        return getBuyerMenu(crops);
      case "ROLE_VENDOR":
        return getVendorMenu(crops);
      case "ROLE_TRADER":
        return getTraderMenu(crops);
      default:
        return {};
    }
  }
}

const getCropsSubmenu = (crops: ICrop[], url: string) => {
  let cropsArray: any[] = [];
  crops.forEach((crop, i) => {
    cropsArray.push({
      title: crop.name,
      page: `${url}/${crop.id}`,
    });
  });
  cropsArray.push({
    title: "Изменить культуры",
    page: "user/profile/crops",
    translate: "SUBMENU.PROFILE.CROPS",
  });
  return cropsArray;
};

// ***ADMIN******ADMIN******ADMIN******ADMIN******ADMIN******ADMIN******ADMIN******ADMIN******ADMIN******ADMIN***

const getAdminMenu = (crops: ICrop[]) => ({
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
                submenu: getCropsSubmenu(crops, "sale/best-bids"),
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
                bullet: "dot",
                submenu: getCropsSubmenu(crops, "sale/all-bids"),
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
                submenu: getCropsSubmenu(crops, "purchase/best-bids"),
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
                submenu: getCropsSubmenu(crops, "purchase/all-bids"),
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
          {
            title: "Тарифы",
            page: "",
            translate: "SUBMENU.TARIFFS",
            submenu: [
              {
                title: "Ограничения",
                page: "tariffs",
                translate: "SUBMENU.TARIFFS.LIMITS",
              },
              {
                title: "Пробный период",
                page: "trial",
                translate: "SUBMENU.TARIFFS.TRIAL",
              },
            ],
          },
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

// ***MANAGER******MANAGER******MANAGER******MANAGER******MANAGER******MANAGER******MANAGER******MANAGER***

const getManagerMenu = (crops: ICrop[]) => ({
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
                submenu: getCropsSubmenu(crops, "sale/best-bids"),
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
                bullet: "dot",
                submenu: getCropsSubmenu(crops, "sale/all-bids"),
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
                submenu: getCropsSubmenu(crops, "purchase/best-bids"),
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
                submenu: getCropsSubmenu(crops, "purchase/all-bids"),
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

// ***SELLER******SELLER******SELLER******SELLER******SELLER******SELLER******SELLER******SELLER******SELLER***

const getVendorMenu = (crops: ICrop[]) => ({
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
            submenu: getCropsSubmenu(crops, "purchase/best-bids"),
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

// ***BUYER******BUYER******BUYER******BUYER******BUYER******BUYER******BUYER******BUYER******BUYER******BUYER***

const getBuyerMenu = (crops: ICrop[]) => ({
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
            submenu: getCropsSubmenu(crops, "sale/best-bids"),
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

// ***TRADER******TRADER******TRADER******TRADER******TRADER******TRADER******TRADER******TRADER******TRADER***

const getTraderMenu = (crops: ICrop[]) => ({
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
                submenu: getCropsSubmenu(crops, "sale/best-bids"),
              },
              {
                title: "Мои объявления",
                page: "sale/my-bids",
                translate: "SUBMENU.MY_BIDS",
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
                submenu: getCropsSubmenu(crops, "purchase/best-bids"),
              },
              {
                title: "Мои объявления",
                page: "purchase/my-bids",
                translate: "SUBMENU.MY_BIDS",
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
