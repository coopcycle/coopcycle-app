import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView, Image, Platform } from 'react-native'
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { CloseIcon } from '@/components/ui/icon';
import * as FileSystem from 'expo-file-system';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

import { useTranslation } from 'react-i18next';

export default ({ photos, onPressClose, onSelectPhoto }) => {

    const { t } = useTranslation();

    return (
        <Box className="bg-background-50 p-4 ">
            <HStack className="justify-between items-center mb-3">
                <Text>{ t('SELECT_PHOTO') }</Text>
                <Button  variant="link" onPress={onPressClose}>
                    <ButtonIcon size="xl" as={CloseIcon} />
                </Button>
            </HStack>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            {photos.map((p, i) => {
               return (
                <Pressable key={`photo-${i}`} className="mb-3" onPress={async () => {

                    let uri = '';
                    if (Platform.OS === 'ios' && p.node.image.uri.startsWith('ph://')) {
                        // uri = p.node.image.uri.split('ph://')[1];
                        const imageData = await CameraRoll.iosGetImageDataById(p.node.image.uri);
                        uri = imageData.node.image.filepath;
                    } else {
                        uri = p.node.image.uri;
                    }

                    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' })

                    onSelectPhoto(base64)
                }}>
                    <Image

                        style={{
                            width: 300,
                            height: 100,
                        }}
                        source={{ uri: p.node.image.uri }}
                    />
                </Pressable>
               );
             })}
            </ScrollView>
        </Box>
    )

}
