export function dataToEntities(data) {
  try {
    return data.GeoObjectCollection.featureMember.map(item => {
      const position = item.GeoObject.Point.pos.split(" ").reverse();

      const address = {
        id: position.join(""),
        name: item.GeoObject.name,
        description: item.GeoObject.description,
        pos: {
          lat: position[0],
          lng: position[1],
        },
      };

      return address;
    });
  } catch (e) {
    return [];
  }
}
