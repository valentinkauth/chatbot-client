import React from "react";
import { AsyncStorage, View, Text, Image, Button } from "react-native";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import * as Animatable from "react-native-animatable";
import LogoTitle from "../components/header/LogoTitle";
import DataTitle from "../components/header/DataTitle";
import ProfileTitle from "../components/header/ProfileTitle";

class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (
        <LogoTitle onPress={() => alert("Hi, I am the GeMuKi Bot!")} />
      ),
      headerRight: () => (
        <DataTitle onPress={() => navigation.navigate("Data")} />
      ),
      headerLeft: () => (
        <ProfileTitle onPress={() => navigation.navigate("Settings")}/>
      ),
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      websocket_url: "ws://localhost:3000/",
      user_id: "test_user",
      user_info: {
        _id: "test_user"
      },
      server_user_info: {
        _id: 2,
        name: "Chatbot",
        avatar:
          "https://is2-ssl.mzstatic.com/image/thumb/Purple124/v4/2c/59/fe/2c59fe4b-c77d-ba7a-6845-a604ac71d4be/source/512x512bb.jpg"
      },
      connected: false
    };

    this.addServerMessage = this.addServerMessage.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.thisistest = this.thisistest.bind(this);
  }

  // Handle storage stuff
  async componentWillMount() {
    // try {
    //   const value = await AsyncStorage.getItem('messages');
    //   if (value !== null) {
    //     // We have data!!
    //     console.log("Data from storage " + value);
    //     // Set stored messages
    //     await this.setState({ messages: value });
    //   }
    // } catch (error) {
    //   console.log("Storage Error:" + error)
    // }
  }

  async componentDidMount() {
    websocket = new WebSocket(this.state.websocket_url);

    websocket.onopen = async event => {
      console.log("Websocket connection opened" + event);
      await this.setState({ connected: true });

      let connectMessage = {
        type: "welcome_back",
        user: this.state.user_id,
        channel: "socket",
        user_profile: this.state.user_id
      };

      websocket.send(JSON.stringify(connectMessage));
    };

    websocket.onclose = async event => {
      console.log("Websocket connection closed" + event);
      await this.setState({ connected: false });
    };

    websocket.onerror = async event => {
      console.log("Websocket error:" + event);
    };

    websocket.onmessage = async event => {
      var message = null;
      try {
        message = JSON.parse(event.data);

        if (message["type"] == "message") {
          this.addServerMessage(message);
        }
      } catch (err) {
        console.log(err);
        return;
      }
    };

    // websocket.addEventListener("message", async (event) => {
    //   console.log(event.data)
    // });
  }

  onSend(messages = []) {
    // Create and send botkit message to server
    var botkitMessage = this.createBotKitMessage(messages[0].text);
    websocket.send(JSON.stringify(botkitMessage));

    // Add message to state (for rendering)
    this.addMessage(messages);
  }

  onSendQuickReply = data => {
    // Access value of quick reply
    var text = data[0].value;

    // Create messages
    var botkitMessage = this.createBotKitMessage(text);
    var message = this.createMessage(text, "user");

    websocket.send(JSON.stringify(botkitMessage));
    this.addMessage(message);
  };

  addServerMessage = message => {
    if (message["type"] == "message" && message["text"]) {
      var newMessage = this.createMessage(message["text"], "server");

      if (message["quick_replies"]) {
        newMessage.quickReplies = {
          type: "radio",
          keepIt: false,
          values: []
        };

        for (var quickReply of message["quick_replies"]) {
          newMessage.quickReplies.values.push({
            title: quickReply.title,
            value: quickReply.payload
          });
        }
      }

      this.addMessage(newMessage);
    }
  };

  // Create message template for gifted chat message (type can either be server or user)
  createMessage = (text, type) => {
    var message = {
      _id: Math.round(Math.random() * 100000000),
      text: text,
      createdAt: new Date()
    };

    switch (type) {
      case "server":
        message.user = this.state.server_user_info;
        break;
      case "user":
        message.user = this.state.user_info;
        break;
      default:
        message.user = { _id: "unknown" };
        break;
    }

    console.log(message);

    return message;
  };

  // Create message template for Botkit message
  createBotKitMessage = text => {
    var message = {
      type: "message",
      text: text,
      user: this.state.user_id,
      channel: "websocket"
    };
    return message;
  };

  // Add one or multiple messages in gifted chat format to state
  addMessage = async messages => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    // try {
    //   await AsyncStorage.setItem('messages', this.state.messages);
    // } catch (error) {
    //   // Error saving data
    // }
  };

  thisistest(data) {
    console.log("This is a test!!" + JSON.stringify(data));
  }

  // Render bubble to appear with animation
  renderBubble = props => {
    // Alternative 1: animation="bounceIn" duration={800}
    // Alternative 2: animation="bounceInUp" duration={800}
    return (
      <Animatable.View animation="fadeInUp" duration={300} iterationDelay={200}>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: "#3966FB"
            }
          }}
        />
      </Animatable.View>
    );
  };

  // Render send button
  // TODO: Fix animation
  // TODO: Create custom send button in GeMuKi color
  renderSend = props => {
    return (
      <Animatable.View animation="fadeIn" duration={300}>
        <Send {...props}>
          <View style={{ marginRight: 0, marginBottom: -25 }}>
            <Image
              source={require("../assets/send.png")}
              resizeMode={"center"}
            />
          </View>
        </Send>
      </Animatable.View>
    );
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.user_id
        }}
        onQuickReply={data => this.onSendQuickReply(data)}
        renderBubble={this.renderBubble}
        renderSend={this.renderSend}
        isAnimated={true}
        placeholder={"Nachricht eingeben..."}
      />
    );
  }
}

export default ChatScreen;
