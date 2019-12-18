import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import botIcon from '../../assets/bot_icon_new.png';

class LogoTitle extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image
          source={botIcon}
          style={{ width: 40, height: 40, marginBottom: 5 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}

export default LogoTitle;
