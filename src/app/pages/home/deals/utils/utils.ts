import { IDealsFilter } from "../../../../interfaces/deals";

export const isDealsFilterEmpty = (filters: IDealsFilter[] | undefined): boolean => {
  let isEmpty = true;
  filters?.forEach(item => {
    if (!!item.parameters.length) {
      isEmpty = false;
    }
  });
  return isEmpty;
};
