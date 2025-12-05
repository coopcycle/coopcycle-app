import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { StyleSheet } from "react-native";
import i18n from "@/src/i18n";

export const TabBar = ({onPress}) => {

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
      divider: {
        height: '70%',
        marginHorizontal: 4,
        backgroundColor: '#999999'
      }
    });
    return (
        <>
            <Button testID="editTabButton" style={styles.buttonTab} onPress={() => onPress('edit')}>
                <Text>{i18n.t('TASK_DETAILS')}</Text>
            </Button>
            <Divider orientation={'vertical'} style={styles.divider}/>
            <Button testID="reportTabButton" style={styles.buttonTab} onPress={() => onPress('report')}>
                <Text>{i18n.t('REPORT_INCIDENT')}</Text>
            </Button>
        </>
    )
};