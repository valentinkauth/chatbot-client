import React from "react";
import { View, ScrollView, Text, Dimensions } from "react-native";
import { Button } from 'react-native-elements';
import WeightGraph from "../components/graphs/WeightGraph"
import ProgressBar from "../components/graphs/ProgressBar"
import ArrowLeft from "../components/header/ArrowLeft";

class DataScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      activeStep: 2,
      data: [],
   };
  }

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
      <ScrollView style={{ flex: 1, marginHorizontal: 10 }}>
        <ProgressBar activeStep={this.state.activeStep}/>
        <WeightGraph />
        <Button
          title="Neuen Wert hinzufügen"
          type="solid"
          buttonStyle={ {backgroundColor: "#3966FB", borderRadius: 16} }
          onPress={() => alert('Wert hinzufügen')}
        />
      </ScrollView>
    );
  }
}

export default DataScreen;
