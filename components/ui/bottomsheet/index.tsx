import GorhomBottomSheet, {
  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
  BottomSheetView as GorhomBottomSheetView,
  BottomSheetHandle,
  BottomSheetTextInput as GorhomBottomSheetInput,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
  BottomSheetFlatList as GorhomBottomSheetFlatList,
  BottomSheetSectionList as GorhomBottomSheetSectionList,
} from '@gorhom/bottom-sheet';
import { Platform, useColorScheme, Pressable, Text } from 'react-native';
import type { PressableProps, TextProps } from 'react-native';
import { FocusScope } from '@gluestack-ui/utils/aria';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cssInterop } from 'nativewind';
import { tva } from '@gluestack-ui/utils/nativewind-utils';

const bottomSheetBackdropStyle = tva({
  base: 'absolute inset-0 flex-1 touch-none select-none bg-black opacity-40',
});

const bottomSheetContentStyle = tva({
  base: 'mt-2',
});

const bottomSheetTriggerStyle = tva({
  base: '',
});

const bottomSheetIndicatorStyle = tva({
  base: 'py-1 w-full items-center rounded-t-lg',
});

const bottomSheetItemStyle = tva({
  base: 'p-3 flex-row items-center rounded-sm w-full disabled:opacity-40 web:pointer-events-auto disabled:cursor-not-allowed hover:bg-background-50 active:bg-background-100 focus:bg-background-100 web:focus-visible:bg-background-100',
});

export const BottomSheetContext = createContext<{
  visible: boolean;
  bottomSheetRef: React.RefObject<GorhomBottomSheet>;
  handleClose: () => void;
  handleOpen: () => void;
  isDarkMode: boolean;
}>({
  visible: false,
  bottomSheetRef: { current: null },
  handleClose: () => {},
  handleOpen: () => {},
  isDarkMode: false,
});

type IBottomSheetProps = React.ComponentProps<typeof GorhomBottomSheet>;
export const BottomSheet = ({
  snapToIndex = 1,
  onOpen,
  onClose,
  ...props
}: {
  snapToIndex?: number;
  children?: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
}) => {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [visible, setVisible] = useState(false);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(snapToIndex);
    setVisible(true);
    onOpen && onOpen();
  }, [onOpen, snapToIndex]);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    setVisible(false);
    onClose && onClose();
  }, [onClose]);

  return (
    <BottomSheetContext.Provider
      value={{
        visible,
        bottomSheetRef,
        handleClose,
        handleOpen,
        isDarkMode,
      }}
    >
      {props.children}
    </BottomSheetContext.Provider>
  );
};

export const BottomSheetPortal = ({
  snapPoints,
  handleComponent: DragIndicator,
  backdropComponent: BackDrop,
  ...props
}: Partial<IBottomSheetProps> & {
  defaultIsOpen?: boolean;
  snapToIndex?: number;
  snapPoints: string[];
}) => {
  const { bottomSheetRef, handleClose, isDarkMode } = useContext(BottomSheetContext);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === 0 || index === -1) handleClose();
    },
    [handleClose]
  );

  return (
    <GorhomBottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      backdropComponent={BackDrop}
      onChange={handleSheetChanges}
      handleComponent={DragIndicator}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      }}
      handleIndicatorStyle={{
        backgroundColor: isDarkMode ? '#666' : '#CCC',
      }}
      {...props}
    >
      {props.children}
    </GorhomBottomSheet>
  );
};

export const BottomSheetTrigger = ({
  className,
  ...props
}: PressableProps & { className?: string }) => {
  const { handleOpen } = useContext(BottomSheetContext);
  return (
    <Pressable
      onPress={(e) => {
        props.onPress && props.onPress(e);
        handleOpen();
      }}
      {...props}
      className={bottomSheetTriggerStyle({ className })}
    >
      {props.children}
    </Pressable>
  );
};

export const BottomSheetBackdrop = ({
  disappearsOnIndex = -1,
  appearsOnIndex = 1,
  className,
  ...props
}: Partial<React.ComponentProps<typeof GorhomBottomSheetBackdrop>> & {
  className?: string;
}) => {
  return (
    <GorhomBottomSheetBackdrop
      className={bottomSheetBackdropStyle({ className })}
      disappearsOnIndex={disappearsOnIndex}
      appearsOnIndex={appearsOnIndex}
      {...props}
    />
  );
};

cssInterop(GorhomBottomSheetBackdrop, { className: 'style' });


export const BottomSheetDragIndicator = ({
  children,
  className,
  ...props
}: Partial<React.ComponentProps<typeof BottomSheetHandle>> & {
  className?: string;
}) => {
  return (
    <BottomSheetHandle
      {...props}
      className={bottomSheetIndicatorStyle({ className })}
    >
      {children}
    </BottomSheetHandle>
  );
};

cssInterop(BottomSheetHandle, { className: 'style' });

export const BottomSheetContent = (props: React.ComponentProps<typeof GorhomBottomSheetView>) => {
  const { handleClose, visible, isDarkMode } = useContext(BottomSheetContext);

  const keyDownHandlers = useMemo(() => {
    return Platform.OS === 'web'
      ? {
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              handleClose();
            }
          },
        }
      : {};
  }, [handleClose]);

  const backgroundColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';

  const contentStyle = [{ backgroundColor }, props.style];

  const content = (
    <GorhomBottomSheetView
      {...props}
      {...keyDownHandlers}
      style={contentStyle}
      className={bottomSheetContentStyle({ className: props.className })}
    >
      <React.Fragment>
        {React.Children.map(props.children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as any, {
                style: [
                  (child.props as any)?.style,
                  { color: textColor },
                ],
              })
            : child
        )}
      </React.Fragment>
    </GorhomBottomSheetView>
  );

  if (Platform.OS === 'web' && visible)
    return (
      <FocusScope contain={visible} autoFocus restoreFocus>
        {content}
      </FocusScope>
    );

  return content;
};

cssInterop(GorhomBottomSheetView, { className: 'style' });

export const BottomSheetItem = ({
  children,
  className,
  closeOnSelect = true,
  ...props
}: PressableProps & { closeOnSelect?: boolean }) => {
  const { handleClose, isDarkMode } = useContext(BottomSheetContext);

  const backgroundColor = isDarkMode ? '#2A2A2A' : '#FFF';
  const textColor = isDarkMode ? '#FFF' : '#000';

  return (
    <Pressable
      {...props}
      className={bottomSheetItemStyle({ className })}
      onPress={(e) => {
        if (closeOnSelect) handleClose();
        props.onPress && props.onPress(e);
      }}
      style={{ backgroundColor }}
      role="button"
    >
      {React.Children.map(children, (child) =>
        typeof child === 'string' ? (
          <Text style={{ color: textColor }}>{child}</Text>
        ) : React.isValidElement(child) ? (
          React.cloneElement(child, {
            style: [
              (child.props as any)?.style,
              { color: textColor },
            ],
          })
        ) : (
          child
        )
      )}
    </Pressable>
  );
};

export const BottomSheetItemText = (props: TextProps) => {
  const { isDarkMode } = useContext(BottomSheetContext);
  return (
    <Text {...props} style={[{ color: isDarkMode ? '#FFF' : '#000' }, props.style]} />
  );
};

export const BottomSheetScrollView = (props: React.ComponentProps<typeof GorhomBottomSheetScrollView>) => {
  const { isDarkMode } = useContext(BottomSheetContext);
  return (
    <GorhomBottomSheetScrollView
      {...props}
      style={[{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }, props.style]}
    />
  );
};

export const BottomSheetFlatList = (props: React.ComponentProps<typeof GorhomBottomSheetFlatList>) => {
  const { isDarkMode } = useContext(BottomSheetContext);
  return (
    <GorhomBottomSheetFlatList
      {...props}
      style={[{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }, props.style]}
      contentContainerStyle={[
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' },
        props.contentContainerStyle,
      ]}
    />
  );
};

export const BottomSheetSectionList = (props: React.ComponentProps<typeof GorhomBottomSheetSectionList>) => {
  const { isDarkMode } = useContext(BottomSheetContext);
  return (
    <GorhomBottomSheetSectionList
      {...props}
      style={[{ backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }, props.style]}
      contentContainerStyle={[
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' },
        props.contentContainerStyle,
      ]}
    />
  );
};

cssInterop(GorhomBottomSheetInput, { className: 'style' });
cssInterop(GorhomBottomSheetScrollView, { className: 'style' });
cssInterop(GorhomBottomSheetFlatList, { className: 'style' });
cssInterop(GorhomBottomSheetSectionList, { className: 'style' });
