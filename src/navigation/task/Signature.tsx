import 'react-native-get-random-values';
import { Directory, EncodingType, Paths } from 'expo-file-system';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import type { SkPath } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { v4 } from 'uuid';

import { addSignature } from '../../redux/Courier';
import { navigateBackToCompleteTask } from '@/src/navigation/utils';
import { compressImage } from '../../utils/imageCompression';

function Signature({ navigation, route, addSignature }) {
  const { t } = useTranslation();
  const canvasRef = useCanvasRef();
  const [completedPaths, setCompletedPaths] = useState<SkPath[]>([]);
  // renderTick forces a re-render so the Canvas redraws the mutated activePathRef
  const [renderTick, setRenderTick] = useState(0);
  const activePathRef = useRef<SkPath | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const panGesture = useMemo(() =>
    Gesture.Pan()
      .runOnJS(true)
      .minDistance(0)
      .onBegin(e => {
        const path = Skia.Path.Make();
        path.moveTo(e.x, e.y);
        activePathRef.current = path;
        setRenderTick(n => n + 1);
      })
      .onUpdate(e => {
        activePathRef.current?.lineTo(e.x, e.y);
        setRenderTick(n => n + 1);
      })
      .onEnd(() => {
        if (activePathRef.current) {
          setCompletedPaths(prev => [...prev, activePathRef.current!]);
          activePathRef.current = null;
        }
      }),
  []);

  const clearSignature = useCallback(() => {
    setCompletedPaths([]);
    activePathRef.current = null;
    setRenderTick(n => n + 1);
  }, []);

  const saveSignature = async () => {
    if (completedPaths.length === 0 && !activePathRef.current) return;
    try {
      const image = canvasRef.current?.makeImageSnapshot();
      if (!image) return;
      const base64 = image.encodeToBase64(ImageFormat.PNG, 100);
      const directory = new Directory(Paths.document, 'pending_uploads');
      if (!directory.exists) directory.create();
      const file = directory.createFile(`${v4()}.png`, 'image/png');
      file.write(base64, { encoding: EncodingType.Base64 });
      const compressed = await compressImage(file.uri);
      const task = route.params?.task;
      addSignature(task, compressed);
      navigateBackToCompleteTask(navigation, route);
    } catch (e) {
      console.error('saveSignature failed:', e);
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
              {completedPaths.map((path, i) => (
                <SkiaPath
                  key={i}
                  path={path}
                  color="black"
                  style="stroke"
                  strokeWidth={3}
                  strokeCap="round"
                  strokeJoin="round"
                />
              ))}
              {activePathRef.current ? (
                <SkiaPath
                  path={activePathRef.current}
                  color="black"
                  style="stroke"
                  strokeWidth={3}
                  strokeCap="round"
                  strokeJoin="round"
                />
              ) : null}
            </Canvas>
          </View>
        </GestureDetector>
        <Button variant="outline" size="sm" onPress={clearSignature}>
          <ButtonText>{t('SIGNATURE_CLEAR')}</ButtonText>
        </Button>
      </VStack>
      <VStack className="p-2">
        <Button size="lg" onPress={saveSignature}>
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
