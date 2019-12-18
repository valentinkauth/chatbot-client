import React from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import WeightGraph from "../components/graphs/WeightGraph";
import GoalsGraph from "../components/graphs/GoalsGraph";
import ProgressBar from "../components/graphs/ProgressBar";
import ArrowLeft from "../components/header/ArrowLeft";

class DataScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 2,
      data: []
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

  questionnairePress = () => {
    this.props.navigation.state.params.startQuestionnaire();
    this.props.navigation.navigate("Chat");
  };

  addWeightButtonPress = () => {
    console.log(this.props.navigation.state.params);
    this.props.navigation.state.params.addWeight();
    this.props.navigation.navigate("Chat");
  };

  render() {
    console.log(this.props.navigation.state.params)
    console.log(
      "Rendering data screen with active step: " +
        this.props.navigation.state.params.activeStep
    );
    return (
      <ScrollView style={{ flex: 1, marginHorizontal: 10 }}>
        <TouchableOpacity onPress={() => this.questionnairePress()}>
          <ProgressBar
            activeStep={this.props.navigation.state.params.activeStep}
          />
        </TouchableOpacity>

        <WeightGraph
          weightData={this.props.navigation.state.params.weightData}
        />
        <Button
          title="Neuen Wert hinzufügen"
          type="solid"
          buttonStyle={{ backgroundColor: "#3966FB", borderRadius: 16 }}
          onPress={() => this.addWeightButtonPress()}
        />
        <GoalsGraph/>
      </ScrollView>
    );
  }
}

export default DataScreen;
