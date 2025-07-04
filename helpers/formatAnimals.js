const formatAnimals = (animals) =>
  animals.map((animal) => {
    const obj = typeof animal.toObject === 'function' ? animal.toObject() : animal;
    const { _id, ...rest } = obj;
    return { id: _id, ...rest };
  });

export default formatAnimals;