import { IDealsFilter } from "../../../../interfaces/deals";

export const isDealsFilterEmpty = (filters: IDealsFilter[] | undefined): boolean => {
  let isEmpty = true;
  if (filters) {
    filters?.forEach(item => {
      if (!!item.parameters.length) {
        isEmpty = false;
      }
    });
  }
  return isEmpty;
};

export const thousands = (inData: string) =>
  inData.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${"\u00A0"}`);
