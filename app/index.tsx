import { StyleSheet, Text, View } from "react-native";
import w3_showDataAfterLogin from '@/views/w3_showDataAfterLogin';
import { db, auth } from '@/constants/firebaseConfig';

export default function App() {
  return (
    <View style={styles.container}>
      <w3_showDataAfterLogin />
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
