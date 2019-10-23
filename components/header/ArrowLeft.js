import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import arrowLeft from '../../assets/arrow_left_icon_white.png';

class ArrowLeft extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image
          source={arrowLeft}
          style={{ width: 30, height: 30, marginLeft: 10 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}

export default ArrowLeft;
