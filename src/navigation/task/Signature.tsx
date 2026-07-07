import 'react-native-get-random-values';
import { Directory, EncodingType, Paths } from 'expo-file-system';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Path, Rect } from 'react-native-svg';
import { connect } from 'react-redux';
import { v4 } from 'uuid';

import { addSignature } from '../../redux/Courier';
import { navigateBackToCompleteTask } from '@/src/navigation/utils';
import { compressImage } from '../../utils/imageCompression';

function Signature({ navigation, route, addSignature }) {
  const { t } = useTranslation();
  const [completedPaths, setCompletedPaths] = useState<string[]>([]);
  const [activePath, setActivePath] = useState('');
  const activePathRef = useRef('');
  const svgRef = useRef<any>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const onCanvasLayout = useCallback((e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setCanvasSize({ width, height });
  }, []);

  const panGesture = useMemo(() =>
    Gesture.Pan()
      .runOnJS(true)
      .minDistance(0)
      .onBegin(e => {
        const path = `M${e.x} ${e.y}`;
        activePathRef.current = path;
        setActivePath(path);
      })
      .onUpdate(e => {
        const path = `${activePathRef.current} L${e.x} ${e.y}`;
        activePathRef.current = path;
        setActivePath(path);
      })
      .onFinalize(() => {
        if (activePathRef.current) {
          setCompletedPaths(prev => [...prev, activePathRef.current]);
          activePathRef.current = '';
          setActivePath('');
        }
      }),
  []);

  const clearSignature = () => {
    setCompletedPaths([]);
    setActivePath('');
    activePathRef.current = '';
  };

  const saveSignature = async () => {
    if (completedPaths.length === 0 && !activePath) return;
    try {
      const base64 = await new Promise<string>(resolve =>
        svgRef.current.toDataURL(resolve),
      );
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
          <View style={styles.canvasContainer} onLayout={onCanvasLayout}>
            <Svg
              ref={svgRef}
              width={canvasSize.width}
              height={canvasSize.height}
              style={StyleSheet.absoluteFill}>
              <Rect
                width={canvasSize.width}
                height={canvasSize.height}
                fill="white"
              />
              {completedPaths.map((d, i) => (
                <Path
                  key={i}
                  d={d}
                  stroke="#000000"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {activePath ? (
                <Path
                  d={activePath}
                  stroke="#000000"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ) : null}
            </Svg>
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
