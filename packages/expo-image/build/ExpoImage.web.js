import React from 'react';
import { Image } from 'react-native';
// import { ImageProps } from './Image';
export default function ExpoImage({ source, ...props }) {
    const resolvedSource = source ?? {};
    return React.createElement(Image, { ...props, source: resolvedSource });
}
//# sourceMappingURL=ExpoImage.web.js.map