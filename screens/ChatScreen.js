import React from "react";
import {
  StyleSheet,
  AsyncStorage,
  View,
  Text,
  Image,
  Button
} from "react-native";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import * as Animatable from "react-native-animatable";
import LogoTitle from "../components/header/LogoTitle";
import DataTitle from "../components/header/DataTitle";
import ProfileTitle from "../components/header/ProfileTitle";

// Push notifications
import getPushToken from "../helpers/pushNotificationHelper";

// To use local host on external device
import Constants from "expo-constants";
import QuickReplies from "react-native-gifted-chat/lib/QuickReplies";
const { manifest } = Constants;

const styles = StyleSheet.create({
  offlineFooter: {
    color: "white",
    fontWeight: "bold",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center"
  }
});

class ChatScreen extends React.Component {
  hello = function() {
    console.log("Hfjdhfklasdjflösdjafö");
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (
        <LogoTitle onPress={() => alert("Hi, I am the GeMuKi Bot!")} />
      ),
      headerRight: () => (
        <DataTitle
          onPress={() =>
            navigation.navigate("Data", {
              addWeight: navigation.state.params.addWeight,
              weightData: [],
              activeStep: 2
            })
          }
        />
      ),
      headerLeft: () => (
        <ProfileTitle
          onPress={() =>
            navigation.navigate("Settings", {
              setUserId: navigation.state.params.setUserId,
              removeMessageHistory: navigation.state.params.removeMessageHistory
            })
          }
        />
      )
    };
  };

  // Websocket class instance
  websocket_uri = `ws://${manifest.debuggerHost.split(":").shift()}:3000`;

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      connected: false,
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
      weightData: [],
      reconnectCounter: 5,
      test: 3
    };

    this.addServerMessage = this.addServerMessage.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.addWeight = this.addWeight.bind(this);
  }

  // LIFECYCLE METHODS
  //_________________________

  // Handle storage stuff
  // TODO: Connect to web socket here, send push token and get user data after connect
  async componentWillMount() {
    var messages = await this.retrieveMessages();
    // Update messages
    this.setState({ messages: messages });
  }

  async componentDidMount() {
    // Start websocket connection
    this.connectWebSocket();

    // Set navigation parameters (needed for passing function as callback in navigation options)
    this.props.navigation.setParams({
      addWeight: this.addWeight,
      removeMessageHistory: this.removeMessageHistory,
      setUserId: this.setUserId
    });
  }

  async componentDidUpdate() {
    // Start reconnect if reconnectCouter is 0 and connection is not active
    if (this.state.reconnectCounter === 0 && !this.state.connected) {
      // Set reconnect counter to 5 again
      this.setState(prevState => ({ reconnectCounter: 5 }));
      console.log(this.state.reconnectCounter);
      clearInterval(this.interval);
      // Start new websocket connection
      this.connectWebSocket();
      //this.websocket = new WebSocket(this.websocket_uri);
    }
  }

  async componentWillUnmount() {
    console.log("unmounting now!");
  }

  // STORAGE METHODS
  //_________________________

  // Store messages in storage
  storeMessages = async messages => {
    try {
      await AsyncStorage.setItem("chatbot_messages", JSON.stringify(messages));
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  };

  // Retrieve messages from storage
  retrieveMessages = async () => {
    var messages = [];
    try {
      messages = (await AsyncStorage.getItem("chatbot_messages")) || "[]";
      if (messages !== null) {
        console.log("Data retrieved from storage");
      }
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
    return JSON.parse(messages);
  };

  // HELPER METHODS
  //_________________________

  connectWebSocket = () => {
    this.websocket = new WebSocket(this.websocket_uri);

    this.websocket.onopen = async event => {
      console.log("Websocket connection opened");

      // Clear old reconnect interval
      clearInterval(this.interval);

      // Update connection state
      this.setState({ connected: true });

      // Update push token (not sure if needed on every start)
      let pushToken = await getPushToken();

      // Initial message to server
      // TODO: change new_conversation field depending on passed time since last connect
      let connectMessage = {
        type: "start",
        push_token: pushToken,
        new_conversation: true,
        user: this.state.user_id,
        channel: "socket",
        user_profile: this.state.user_id
      };
      this.websocket.send(JSON.stringify(connectMessage));

      // Second message to server to get current user data
      let userDataMessage = {
        type: "user_data",
        user: this.state.user_id,
        channel: "socket",
        user_profile: this.state.user_id
      };
      this.websocket.send(JSON.stringify(userDataMessage));
    };

    this.websocket.onclose = async event => {
      console.log("Websocket connection closed" + event);

      this.setState({ connected: false });
      this.setState(prevState => ({ reconnectCounter: 5 }));

      // clear old interval
      clearInterval(this.interval);

      // TODO: Set connected and reconnect counter
      this.interval = setInterval(
        () =>
          this.setState(prevState => ({
            reconnectCounter: prevState.reconnectCounter - 1
          })),
        1000
      );
    };

    this.websocket.onerror = async event => {
      console.log("Websocket error:" + event);
      this.setState({ connected: false });
      this.websocket.close();
    };

    this.websocket.onmessage = async event => {
      var message = null;
      try {
        message = JSON.parse(event.data);

        // TODO: Switch message type
        if (message["type"] == "message") {
          this.addServerMessage(message);
        }
      } catch (err) {
        console.log(err);
        return;
      }
    };
  };

  onSend(messages = []) {
    // Create and send botkit message to server
    var botkitMessage = this.createBotkitEvent(messages[0].text, "message");
    this.websocket.send(JSON.stringify(botkitMessage));

    // Add message to state (for rendering)
    this.addMessage(messages);
  }

  onSendQuickReply = data => {
    // Access value of quick reply
    var text = data[0].value;

    // Create messages
    var botkitMessage = this.createBotkitEvent(text, "message");
    var message = this.createMessage(text, "user");

    if (this.state.connected) {
      this.websocket.send(JSON.stringify(botkitMessage));
      this.addMessage(message);
    } else {
      console.log("Can not send quick reply while being offline");
    }
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

    return message;
  };

  // Create message template for Botkit message
  createBotkitEvent = (text, type) => {
    var message = {
      type: type,
      text: text,
      user: this.state.user_id,
      channel: "websocket"
    };
    return message;
  };

  // Add one or multiple messages in gifted chat format to state
  addMessage = async messages => {
    // Update state and update local storage in callbakc
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => this.storeMessages(this.state.messages)
    );
  };

  // CALLBACK METHODS
  //_________________________

  // Send event to server to start weight measurement dialog
  addWeight = () => {
    var event = this.createBotkitEvent("", "weight_manual");
    if (this.state.connected) {
      this.websocket.send(JSON.stringify(event));
    }
  };

  // Set new user name and reconnect
  setUserId = userId => {
    this.setState({ user_id: userId }, () => {
      this.connectWebSocket();
    });
  };

  // Set empty messages array in state and store empty array in storage
  removeMessageHistory = () => {
    this.setState({ messages: [] }, () => {
      this.storeMessages(this.state.messages);
    });
  };

  // RENDER METHODS
  //_________________________

  // Render bubble to appear with animation
  renderBubble = props => {
    // Alternative 1: animation="bounceIn" duration={800}
    // Alternative 2: animation="bounceInUp" duration={800}
    return (
      <Animatable.View animation="fadeInUp" duration={300} iterationDelay={0}>
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

  renderFooter = props => {
    if (!this.state.connected) {
      return (
        <View style={styles.offlineFooter}>
          <Text style={styles.offlineFooter}>
            Der Chat ist offline. Reconnect in {this.state.reconnectCounter}{" "}
            Sekunden.
          </Text>
        </View>
      );
    }
    return null;
  };

  // Render send button
  // TODO: Fix animation
  renderSend = props => {
    if (this.state.connected) {
      return (
        <Animatable.View animation="fadeIn" duration={300}>
          <Send {...props}>
            <View
              style={{
                marginRight: 10,
                marginBottom: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{
                  width: 40,
                  height: 40,
                  resizeMode: "contain"
                }}
                source={require("../assets/send.png")}
              />
            </View>
          </Send>
        </Animatable.View>
      );
    } else {
      return null;
    }
  };

  renderQuickReplies = props => {
    // Check if curernt message with quick replies exist
    if (!props.currentMessage) {
      return;
    } else if (!props.currentMessage.quickReplies) {
      return;
    }

    var message = props.currentMessage;

    for (let quickReply of message.quickReplies.values) {
      if (quickReply.value == "Letzte Frage wiederholen") {
        console.log(quickReply);
        index = message.quickReplies.values.indexOf(quickReply);
        message.quickReplies.values.splice(index, 1);

        //var messageNew = message;
        //messageNew.quickReplies.values = [quickReply];

        return (
          <View>
            <QuickReplies currentMessage={message} />
            <QuickReplies color="red" currentMessage={message} />
          </View>
        );
      }
    }

    return (
      <View>
        <QuickReplies {...props} />
        <QuickReplies currentMessage={message} />
      </View>
    );
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        onQuickReply={data => this.onSendQuickReply(data)}
        user={{
          _id: this.state.user_id
        }}
        renderBubble={this.renderBubble}
        renderSend={this.renderSend}
        //renderQuickReplies={this.renderQuickReplies}
        renderChatFooter={this.renderFooter}
        isAnimated={true}
        placeholder={"Nachricht eingeben..."}
      />
    );
  }
}

export default ChatScreen;
