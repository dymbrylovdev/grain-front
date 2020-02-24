import React from "react";
import { useSelector, shallowEqual } from "react-redux";

function CropSelector(id) {
  const { crop } = useSelector(({ crops: { crops } }) => {
    const currentCrop = crops.filter(item => item.id === Number.parseInt(id));
    if (currentCrop.length > 0) {
      return currentCrop[0];
    }
    return { crop: {} };
  }, shallowEqual);
  return { crop };
}
