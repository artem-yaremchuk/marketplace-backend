const formatAnimals = (animals) =>
  animals.map((animal) => {
    const { _id, ...rest } = animal.toObject();
    return { id: _id, ...rest };
  });

export default formatAnimals;