import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";

class ProgressBar extends Component {
  render() {
    return (
      <View style={{alignItems: "center", flex: 1, height: 100, marginTop: 15 }}>
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 20, marginBottom: -10 }}>
          Deine Vorsorgegespräche
        </Text>
        <ProgressSteps activeStep={this.props.activeStep} borderWidth={3}>
        <ProgressStep label="S0" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="S1" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="H1" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="S2" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="H2" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="S3" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        </ProgressSteps>
      </View>
    );
  }
}

export default ProgressBar;
