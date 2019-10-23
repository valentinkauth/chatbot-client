import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import arrowRight from '../../assets/arrow_right_icon_white.png';

class ArrowRight extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image
          source={arrowRight}
          style={{ width: 30, height: 30, marginRight: 10 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}

export default ArrowRight;
