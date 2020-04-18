export interface IBreadCrumb {
  title: string;
  root?: boolean;
  icon?: string;
  page: string;
  translate?: string;
}

export interface IBreadCrumbWithSubmenu extends IBreadCrumb {
  submenu: IBreadCrumb[];
}
