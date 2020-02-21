const getAdressComponentName = (name, component) => {
  try {
    return component.find(item => item.kind === name)["name"];
  } catch (error) {
    return "";
  }
};

export function dataToEntities(data) {
  try {
    return data.GeoObjectCollection.featureMember.map(item => {
      const position = item.GeoObject.Point.pos.split(" ").reverse();

      const metaData = item.GeoObject.metaDataProperty.GeocoderMetaData;

      const addressComponents = metaData.Address.Components;
      const address = {
        id: position.join(", "),
        country: getAdressComponentName("country", addressComponents),
        province: getAdressComponentName("province", addressComponents),
        city: getAdressComponentName("locality", addressComponents),
        street: getAdressComponentName("street", addressComponents),
        house: getAdressComponentName("house", addressComponents),
        text: metaData.text,
        lat: position[0],
        lng: position[1],
      };

      return address;
    });
  } catch (e) {
    return [];
  }
}
