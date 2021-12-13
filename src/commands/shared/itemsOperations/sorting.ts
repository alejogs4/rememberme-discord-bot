export function sortField<Type extends object, Field extends keyof Type>(order: 'ASC' | 'DESC', key: Field) {
  return (elementA: Type, elementB: Type) => {
    const elementFieldA = elementA[key];
    const elementFieldB = elementB[key];

    if (order === 'ASC') {
      return elementFieldA > elementFieldB ? 1 : -1;
    }
    return elementFieldA < elementFieldB ? 1 : -1;
  };
}
