import { EllipsisVertical } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export const HeaderRightEditBody = (() => {

    return (
        <View style={styles.container}>
            <Text style={styles.counter}>{}</Text>
            <EllipsisVertical />
        </View>
    );
});

// TODO: Modify
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 10
    },
    counter: {
        color: "white",
        backgroundColor: "#666",
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 24,
        textAlign: 'center'
    }
});
