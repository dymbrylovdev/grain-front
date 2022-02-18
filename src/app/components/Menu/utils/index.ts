import { IUser } from "../../../interfaces/users";
import { accessByRoles } from "../../../utils/utils";

export const salePurchaseModeForMyBids = (me?: IUser, salePurchaseMode?: "sale" | "purchase") => {
  if (accessByRoles(me, ["ROLE_BUYER"])) return "purchase";
  if (accessByRoles(me, ["ROLE_VENDOR"])) return "sale";
  return salePurchaseMode;
};
