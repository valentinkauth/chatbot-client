import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";

class ProgressBar extends Component {
  render() {
    return (
      <View style={{ flex: 1, height: 100 }}>
        <ProgressSteps activeStep={this.props.activeStep} borderWidth={2}>
        <ProgressStep label="S1" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="S2" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="H1" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="U1" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="U2" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        <ProgressStep label="U3" nextBtnDisabled={true} previousBtnDisabled={true} previousBtnText={""} nextBtnText={""} finishBtnText={""} />
        </ProgressSteps>
      </View>
    );
  }
}

export default ProgressBar;
