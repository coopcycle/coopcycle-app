import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import Complete from "./Complete";
import { EditTask } from "./Edit";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { TabBar } from "./components/TabBar";

export const Report = () => {
    const [currentTab, setCurrentTab] = useState<'edit' | 'report'>('report');

    const styles = StyleSheet.create({
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

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab as 'edit' | 'report');
    };
    const isReportTab = currentTab === 'report';

    return(
        <VStack style={{ flex: 1}}>
            <HStack style={ styles.tabBar }> 
                <TabBar onPress={handleTabChange}/>
            </HStack>
            {isReportTab ? <Complete /> : <EditTask onSubmit={() => {}} />}
        </VStack>
    )
};