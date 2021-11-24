import { useState, useEffect } from "react";

export const useIsFirstRender = () => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => setIsFirstRender(false), []);
  return isFirstRender;
};
