import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { CircleX } from 'lucide-react-native';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

interface IAttachmentItemProps {
  base64: string;
  onPressDelete: () => void;
}
export const AttachmentItem = ({
  base64,
  onPressDelete,
}: IAttachmentItemProps) => {
  const { width } = Dimensions.get('window');

  const imageSize = (width - 64) / 2;

  if (
    !base64.startsWith('file://') &&
    !base64.startsWith('data:image/jpeg;base64')
  ) {
    base64 = `data:image/jpeg;base64,${base64}`;
  }

  return (
    <View style={[styles.image, { width: imageSize, height: imageSize }]}>
      <Image
        source={{ uri: base64 }}
        style={{ width: imageSize - 2, height: imageSize - 2 }}
      />
      <TouchableOpacity style={styles.imageDelBtn} onPress={onPressDelete}>
        <Icon as={CircleX} size={40} style={{ color: 'black' }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  imageDelBtn: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    top: -16,
    right: -16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
