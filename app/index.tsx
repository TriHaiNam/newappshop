import { StyleSheet, Text, View } from "react-native";
import { db, auth } from '@/constants/firebaseConfig';
import W3_showDataAfterLogin from "@/views/w3_showDataAfterLogin";

export default function App() {
  return (
    <View style={styles.container}>
      <W3_showDataAfterLogin />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
