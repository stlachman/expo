import React from 'react';

import ExpoImageView from './ExpoImage';

export default class Image extends React.Component {
  render(): React.ReactNode {
    return <ExpoImageView {...this.props} />;
  }
}
