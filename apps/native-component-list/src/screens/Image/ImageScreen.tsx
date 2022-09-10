//import ImageScreen from './ImageTestsScreen';
// import Constants, { ExecutionEnvironment } from 'expo-constants';

// import ImageScreen from './ImageAllTestsScreen';

// if (Constants.executionEnvironment !== ExecutionEnvironment.Bare) {
//   throw new Error('expo-image not yet supported in managed apps');
// }

// export default ImageScreen;

import Image, { ImageTransitionTiming, ImageTransitionEffect } from 'expo-image';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';

import { FunctionParameter } from '../../components/FunctionDemo';
import Configurator from '../../components/FunctionDemo/Configurator';
import { useArguments } from '../../components/FunctionDemo/FunctionDemo';
import images from './images/images';

const parameters: FunctionParameter[] = [
  {
    name: 'source',
    type: 'enum',
    values: [
      { name: 'random', value: 'random' },
      { name: 'PNG (network)', value: images.uri_png },
      { name: 'JPG (network)', value: images.uri_jpg },
      { name: 'GIF (network)', value: images.uri_gif },
      { name: 'ICO (network)', value: images.uri_ico },
    ],
  },
  {
    name: 'resizeMode',
    type: 'enum',
    values: [
      { name: 'default', value: undefined },
      { name: 'cover', value: 'cover' },
      { name: 'contain', value: 'contain' },
      { name: 'stretch', value: 'stretch' },
      { name: 'repeat', value: 'repeat' },
      { name: 'center', value: 'center' },
    ],
  },
  {
    name: 'transition',
    type: 'object',
    properties: [
      {
        name: 'duration',
        type: 'number',
        values: [0, 0.2, 1, 5],
      },
      {
        name: 'timing',
        type: 'enum',
        values: [
          { name: 'default', value: undefined },
          { name: 'Ease in out', value: ImageTransitionTiming.EASE_IN_OUT },
          { name: 'Ease in', value: ImageTransitionTiming.EASE_IN },
          { name: 'Ease out', value: ImageTransitionTiming.EASE_OUT },
          { name: 'Linear', value: ImageTransitionTiming.LINEAR },
        ],
      },
      {
        name: 'effect',
        type: 'enum',
        values: [
          { name: 'Cross disolve', value: ImageTransitionEffect.CROSS_DISOLVE },
          { name: 'Flip from left', value: ImageTransitionEffect.FLIP_FROM_LEFT },
          { name: 'Flip from right', value: ImageTransitionEffect.FLIP_FROM_RIGHT },
          { name: 'Flip from top', value: ImageTransitionEffect.FLIP_FROM_TOP },
          { name: 'Flip from bottom', value: ImageTransitionEffect.FLIP_FROM_BOTTOM },
          { name: 'Curl up', value: ImageTransitionEffect.CURL_UP },
          { name: 'Curl down', value: ImageTransitionEffect.CURL_DOWN },
        ],
      },
    ],
  },
  {
    name: 'style',
    type: 'object',
    properties: [
      {
        name: 'borderRadius',
        type: 'number',
        values: [0, 30, 500],
      },
      {
        name: 'borderWidth',
        type: 'number',
        values: [5, 0],
      },
    ],
  },
];

export default function ImageScreen() {
  const [args, updateArgument] = useArguments(parameters);
  const source =
    args[0] === 'random'
      ? { uri: `https://source.unsplash.com/random?${Math.floor(Math.random() * 1000)}` }
      : args[0];

  console.log(Object.keys(global.ExpoModules.ExpoImage));
  console.log(global.ExpoModules.ExpoImage.maxConcurrentPrefetchCount);
  console.log(global.ExpoModules.ExpoImage.ImagePrefetchToken.prototype);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Configurator parameters={parameters} onChange={updateArgument} value={args} />

      <View style={styles.imageContainer}>
        <Image
          style={[styles.image, args[3]]}
          source={source}
          resizeMode={args[1]}
          transition={args[2]}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    margin: 10,
  },
  imageContainer: {
    alignItems: 'center',
    margin: 20,
  },
  image: {
    width: Dimensions.get('window').width / 1.2,
    height: 500,
    borderColor: 'cornflowerblue',
  },
});
