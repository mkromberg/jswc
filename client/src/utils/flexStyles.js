export const parseFlexStyles = (inputString) => {
  const stylesArray = inputString?.split(',').map((style) => style.trim());
  const stylesObject = {};

  stylesArray?.forEach((style) => {
    const [property, value] = style?.split(':').map((item) => item.trim());
    const camelCaseProperty = property?.replace(/-([a-z])/g, (match, letter) =>
      letter?.toUpperCase()
    );
    stylesObject[camelCaseProperty] = isNaN(value) ? value : parseFloat(value);
  });

  return stylesObject;
};
