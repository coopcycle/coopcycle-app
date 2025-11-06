import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import Complete from './Complete';
import { EditTask } from './Edit';
import { StyleSheet, View } from 'react-native';
import { useCallback, useState } from 'react';
import { TabBar } from './components/TabBar';
import { Header } from './components/Header';
import { useRoute } from '@react-navigation/native';

export const Report = () => {
  const [currentTab, setCurrentTab] = useState<'edit' | 'report'>('report');
  const { params } = useRoute();
  const task = params?.task;

  const handleTabChange = useCallback((tab: string) => {
    setCurrentTab(tab as 'edit' | 'report');
  }, []);

  return (
    <VStack style={{ flex: 1 }}>
      <HStack style={styles.tabBar}>
        <TabBar onPress={handleTabChange} />
      </HStack>
      <Header task={task} />
      <View style={{ flex: 1, position: 'relative' }}>
        <View
          style={[
            styles.tabContent,
            currentTab === 'report' ? styles.visible : styles.hidden,
          ]}>
          <Complete />
        </View>
        <View
          style={[
            styles.tabContent,
            currentTab === 'edit' ? styles.visible : styles.hidden,
          ]}>
          <EditTask task={task} onSubmit={r => console.log('SUBMIT: ', r)} />
        </View>
      </View>
    </VStack>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: '5%',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonTab: {
    flex: 1,
    margin: 4,
    color: 'black',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: '#D9D9D9',
    flexDirection: 'row',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
  visible: {
    opacity: 1,
    zIndex: 1,
  },
  hidden: {
    opacity: 0,
    zIndex: 0,
  },
});
