import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import profileIcon from '../../assets/profile_icon_white.png';

class ProfileTitle extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Image
          source={profileIcon}
          style={{ width: 30, height: 30, marginLeft: 10 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  }
}

export default ProfileTitle;
