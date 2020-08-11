import { IUser, TRole } from "../interfaces/users";

export function itemById<T extends any>(items: T[], id: number): T | undefined {
  let newItem: T | undefined = undefined;
  if (items && items.length) {
    items.forEach(item => {
      // @ts-ignore
      if (item.id === id) {
        newItem = item;
      }
    });
  }
  return newItem;
}

export const accessByRoles = (who: IUser | undefined, roles: TRole[]): boolean => {
  if (!who) {
    return false;
  } else {
    if (roles.includes(who.roles[0])) {
      return true;
    } else {
      return false;
    }
  }
};
