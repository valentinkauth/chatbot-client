import React from "react";
import { View, Text} from "react-native";
import ArrowRight from "../components/header/ArrowRight";

class SettingsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Dein Profil",
      headerRight: () => (
        <ArrowRight onPress={() => navigation.navigate("Chat")}/>
      ),
      headerLeft: null,
    };
  };

    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Profile and Settings Screen</Text>
        </View>
      );
    }
  }

  export default SettingsScreen;