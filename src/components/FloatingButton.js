import { Fab, Icon } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { whiteColor } from '../styles/common';

function FloatingButton({ onPressed, iconName }) {

  return <>
    <Fab
      renderInPortal={false}
      shadow={2}
      placement="bottom-right"
      onPress={onPressed}
      style={{
        width: 80,
        height: 80,
        marginBottom: 12,
        marginRight: 8
      }}
      icon={
        <Icon
          as={FontAwesome}
          name={iconName}
          color={whiteColor}
          size="lg"
          testID="bulkAssignButton"
          style={{ marginStart: 10 }}
        />
      } />
      </>
}
export default FloatingButton
