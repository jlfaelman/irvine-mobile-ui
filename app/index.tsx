import { View } from "react-native";
import DashboardScreen from './components/Dashboard/DashboardScreen';

export default function Index() {
  return (
    <View style={{flex:1, backgroundColor:'white'}}>
      <DashboardScreen/>
    </View>
  );
}
