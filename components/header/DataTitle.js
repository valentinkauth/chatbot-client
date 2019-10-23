import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import dataIcon from '../../assets/data_icon_white.png';

class DataTitle extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image
          source={dataIcon}
          style={{ width: 30, height: 30, marginRight: 10 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}

export default DataTitle;
