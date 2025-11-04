import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import Complete from './Complete';
import { EditTask } from './Edit';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { TabBar } from './components/TabBar';
import { Header } from './components/Header';
import { useRoute } from '@react-navigation/native';

export const Report = () => {
  const [currentTab, setCurrentTab] = useState<'edit' | 'report'>('report');
  const { params } = useRoute();
  const task = params?.task;

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as 'edit' | 'report');
  };
  const isReportTab = currentTab === 'report';

  return (
    <VStack style={{ flex: 1 }}>
      <HStack style={styles.tabBar}>
        <TabBar onPress={handleTabChange} />
      </HStack>
      <Header task={task} />
      {isReportTab ? (
        <Complete />
      ) : (
        <EditTask task={task} onSubmit={(r) => {console.log("SUBMIT: ",r)}} />
      )}
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
});
