import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";

class ProgressBar extends Component {
  render() {
    return (
      <View style={{alignItems: "center", flex: 1, height: 100, marginTop: 15 }}>
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 20, marginBottom: -10 }}>
          Deine Fragebögen
        </Text>
        <ProgressSteps activeStep={this.props.activeStep} borderWidth={3}>
        <ProgressStep label="T0" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="T1" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="T2" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="T3" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        </ProgressSteps>
      </View>
    );
  }
}

export default ProgressBar;
