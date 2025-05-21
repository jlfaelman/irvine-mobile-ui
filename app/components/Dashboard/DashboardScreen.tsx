import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        paddingTop: 40
    },
    homeTitle: {
        fontSize: 20
    },
    dashboardButtonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        height: '40%',
        aspectRatio: 1,
        backgroundColor: 'white',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#bbbbbb',
        padding: 15,
        borderRadius: 8,
        flexWrap: 'wrap',


    },
    gridFlex: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
    }

})

const data = Array.from({ length: 4 }, (_, i) => `Item ${i + 1}`);


export default function DashboardScreen() {
    return (
        <View style={styles.screen}>
            <Text style={styles.homeTitle}>Home</Text>
            <View style={styles.dashboardButtonContainer}>

                {/* dashoard buttons */}
                {data.map((item, index) => (
                    <View key={index} style={styles.gridItem}>
                        <View style={styles.gridFlex}>
                            <MaterialIcons name="home" size={24} color="black" />
                            <Text>Add Reading</Text>
                        </View>
                    </View>
                ))}
                {/* dashoard buttons */}

                <View>
                    <Text>hello</Text>
                </View>
            </View>
        </View>
    )
}