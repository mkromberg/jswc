export const getImageStyles = (decideImageStyle, PORT, ImageData) => {
  let imageStyles = null;

  if (decideImageStyle == 0) {
    imageStyles = {
      backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundRepeat: 'no-repeat',
      height: '100%',
      width: '100%',
    };
  }

  if (decideImageStyle == 1) {
    imageStyles = {
      backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
      backgroundRepeat: 'repeat',
    };
  }

  if (decideImageStyle == 2) {
    imageStyles = {
      backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
  }

  if (decideImageStyle == 3) {
    imageStyles = {
      backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
      backgroundPosition:
        'center center' /* Center the background image horizontally and vertically */,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  if (ImageData?.Properties?.Type == 'Icon') {
    imageStyles = {
      ...imageStyles,
      height: '32px',
      width: '32px',
      backgroundSize: 'cover',
    };
  }

  return imageStyles;
};

// Image is Tile
// if (Picture && Picture[1] == 1) {
//   updatedStyles = {
//     ...styles,
//     backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
//     backgroundRepeat: 'repeat',
//   };
// }

// // Align the Image in the top left Corner

// if (Picture && Picture[1] == 0) {
//   updatedStyles = {
//     ...styles,
//     backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//   };
// }

// // Make the image center in the subform

// if (Picture && Picture[1] == 3) {
//   updatedStyles = {
//     ...styles,
//     backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
//     backgroundPosition:
//       'center center' /* Center the background image horizontally and vertically */,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundRepeat: 'no-repeat',
//   };
// }

// // Image is Scalar means Image fit exactly horizontally and vertically

// if (Picture && Picture[1] == 2) {
//   updatedStyles = {
//     ...styles,
//     backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
//     backgroundSize: '100% 100%',
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center center',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   };
// }

export const renderImage = (PORT, ImageData) => {
  return `http://localhost:${PORT}${ImageData?.Properties?.File}`;
};
