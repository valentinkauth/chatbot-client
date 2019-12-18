import React from "react";
import { View, Text, TextInput } from "react-native";
import { Button, Input, Icon } from "react-native-elements";
import ArrowRight from "../components/header/ArrowRight";

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Dein Profil",
      headerRight: () => (
        <ArrowRight onPress={() => navigation.navigate("Chat")} />
      ),
      headerLeft: null
    };
  };

  async componentWillMount() {
    // Get current user name
    this.setState({ userName: this.props.navigation.state.params.userId });
  }

  render() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Input
          placeholder="Bitte User Name eingeben (z.B. test_user)"
          value={this.state.userName}
          onChangeText={input => {
            this.setState({ userName: input });
          }}
        />
        <Button
          icon={<Icon name="cached" size={20} color="white" />}
          title="Mit User verbinden"
          type="solid"
          buttonStyle={{
            backgroundColor: "#00ff00",
            borderRadius: 16,
            marginTop: 20
          }}
          onPress={() => {
            this.props.navigation.state.params.setUserId(this.state.userName);
            this.props.navigation.navigate("Chat");
          }}
        />
        <Button
          icon={<Icon name="delete" size={20} color="white" />}
          title="Chatverlauf löschen"
          type="solid"
          buttonStyle={{
            backgroundColor: "#FF0000",
            borderRadius: 16,
            marginTop: 20
          }}
          onPress={() =>
            this.props.navigation.state.params.removeMessageHistory()
          }
        />
      </View>
    );
  }
}

export default SettingsScreen;
