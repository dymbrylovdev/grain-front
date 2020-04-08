export function itemById<T extends any>(items: T[], id: number): T | undefined {
  let newItem: T | undefined = undefined;
  if (items && items.length) {
    items.forEach(item => {
      if (item.id === id) {
        newItem = item;
      }
    });
  }
  return newItem;
}
