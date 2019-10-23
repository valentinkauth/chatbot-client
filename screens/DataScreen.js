import React from "react";
import { View, Text, Dimensions } from "react-native";
import { Button } from 'react-native-elements';
import WeightGraph from "../components/graphs/WeightGraph"
import ArrowLeft from "../components/header/ArrowLeft";

class DataScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Daten",
      headerLeft: () => (
        <ArrowLeft onPress={() => navigation.navigate("Chat")} />
      )
    };
  };

  render() {
    return (
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <WeightGraph />
        <Button
          title="Neuen Wert hinzufügen"
          type="solid"
          buttonStyle={ {backgroundColor: "#3966FB", borderRadius: 16} }
          onPress={() => alert('Wert hinzufügen')}
        />
      </View>
    );
  }
}

export default DataScreen;
