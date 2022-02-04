import { useMemo } from "react";

const getIds = () => {
  const storageIds = localStorage.getItem("viewedBids");
  const ids = storageIds ? JSON.parse(storageIds) : null;
  return ids;
};

export const useIsViewed = (id?: number) => {
  return useMemo(() => {
    const ids = getIds();
    return ids ? ids.find(item => item === id) : false;
  }, [id]);
};

export const setViewed = (id?: number) => {
  const ids = getIds();
  const isViewed = ids ? ids.find(item => item === id) : false;
  if (!isViewed && id) {
    ids ? localStorage.setItem("viewedBids", JSON.stringify([...ids, id])) : localStorage.setItem("viewedBids", JSON.stringify([id]));
  }
};
