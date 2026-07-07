import 'react-native-get-random-values';
import { Directory, Paths } from 'expo-file-system';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  Canvas,
  Path as SkiaPath,
  Rect,
  Skia,
  useCanvasRef,
  ImageFormat,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { connect } from 'react-redux';
import { v4 } from 'uuid';

import { addSignature } from '../../redux/Courier';
import { navigateBackToCompleteTask } from '@/src/navigation/utils';
import { compressImage } from '../../utils/imageCompression';

const STROKE_WIDTH = 3;

function Signature({ navigation, route, addSignature }) {
  const { t } = useTranslation();
  const canvasRef = useCanvasRef();
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [hasSignature, setHasSignature] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Both paths live on the UI thread. `currentPath` is the in-progress
  // stroke; `committedPath` accumulates all finished strokes. Drawing the
  // active stroke on the UI thread (no runOnJS, no React re-renders per point)
  // is what keeps the ink following the finger on a real device.
  const currentPath = useSharedValue(Skia.Path.Make());
  const committedPath = useSharedValue(Skia.Path.Make());

  const markHasSignature = useCallback(() => setHasSignature(true), []);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .onStart(e => {
          'worklet';
          const path = Skia.Path.Make();
          path.moveTo(e.x, e.y);
          currentPath.value = path;
        })
        .onChange(e => {
          'worklet';
          currentPath.value.lineTo(e.x, e.y);
          // Reassign a copy so Skia re-reads the path and redraws this frame.
          currentPath.value = currentPath.value.copy();
        })
        .onEnd(() => {
          'worklet';
          committedPath.value.addPath(currentPath.value);
          committedPath.value = committedPath.value.copy();
          currentPath.value = Skia.Path.Make();
          runOnJS(markHasSignature)();
        }),
    [currentPath, committedPath, markHasSignature],
  );

  const clearSignature = useCallback(() => {
    currentPath.value = Skia.Path.Make();
    committedPath.value = Skia.Path.Make();
    setHasSignature(false);
  }, [currentPath, committedPath]);

  const saveSignature = async () => {
    if (!hasSignature || isSaving) return;
    setIsSaving(true);
    try {
      const image = canvasRef.current?.makeImageSnapshot();
      if (!image) {
        setIsSaving(false);
        return;
      }
      const base64 = image.encodeToBase64(ImageFormat.PNG, 100);
      const directory = new Directory(Paths.document, 'pending_uploads');
      if (!directory.exists) directory.create();
      const file = directory.createFile(`${v4()}.png`, 'image/png');
      file.write(base64, { encoding: 'base64' });
      const compressed = await compressImage(file.uri);
      const task = route.params?.task;
      addSignature(task, compressed);
      navigateBackToCompleteTask(navigation, route);
    } catch (e) {
      console.error('saveSignature failed:', e);
      setIsSaving(false);
    }
  };

  return (
    <VStack flex={1}>
      <VStack flex={1} className="p-2">
        <Text className="text-center mb-4">
          {t('SIGNATURE_DISCLAIMER')}
        </Text>
        <GestureDetector gesture={panGesture}>
          <View
            style={styles.canvasContainer}
            onLayout={e => {
              const { width, height } = e.nativeEvent.layout;
              setCanvasSize({ width, height });
            }}>
            <Canvas ref={canvasRef} style={StyleSheet.absoluteFill}>
              <Rect
                x={0}
                y={0}
                width={canvasSize.width}
                height={canvasSize.height}
                color="white"
              />
              <SkiaPath
                path={committedPath}
                color="black"
                style="stroke"
                strokeWidth={STROKE_WIDTH}
                strokeCap="round"
                strokeJoin="round"
              />
              <SkiaPath
                path={currentPath}
                color="black"
                style="stroke"
                strokeWidth={STROKE_WIDTH}
                strokeCap="round"
                strokeJoin="round"
              />
            </Canvas>
          </View>
        </GestureDetector>
        <Button variant="outline" size="sm" onPress={clearSignature}>
          <ButtonText>{t('SIGNATURE_CLEAR')}</ButtonText>
        </Button>
      </VStack>
      <VStack className="p-2">
        <Button size="lg" onPress={saveSignature} isDisabled={isSaving}>
          {isSaving && <ButtonSpinner className="mr-2" />}
          <ButtonText>{t('SIGNATURE_ADD')}</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    marginBottom: 20,
    borderColor: '#000000',
    borderWidth: 1,
    backgroundColor: 'white',
  },
});

function mapDispatchToProps(dispatch) {
  return {
    addSignature: (task, uri) => dispatch(addSignature(task, uri)),
  };
}

export default connect(null, mapDispatchToProps)(Signature);
