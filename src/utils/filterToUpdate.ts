const keysToChange = ['title'];

export const filter = (rawToChange: PartialRawRoom) => {
  const newObj: PartialRawRoom = {};

  Object.entries(rawToChange).forEach(([key, value]) => {
    if (!keysToChange.includes(key) || !value) {
      return;
    }

    newObj[key as keyof PartialRawRoom] = value;
  });

  return newObj;
};
