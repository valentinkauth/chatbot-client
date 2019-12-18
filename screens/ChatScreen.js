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

// Chatbot icon
import botIcon from '../assets/bot_icon_new.png';

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
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (
        <LogoTitle
          onPress={() =>
            alert(
              "Hey, ich bin Freya, dein digitaler Assistens und Begleiter während dem Interventionsprogramm GeMuKi"
            )
          }
        />
      ),
      headerRight: () => (
        <DataTitle
          onPress={() =>
            navigation.navigate("Data", {
              addWeight: navigation.state.params.addWeight,
              startQuestionnaire: navigation.state.params.startQuestionnaire,
              weightData: navigation.state.params.weight_measurements,
              activeStep: navigation.state.params.questionnaire_stage
            })
          }
        />
      ),
      headerLeft: () => (
        <ProfileTitle
          onPress={() =>
            navigation.navigate("Settings", {
              userId: navigation.state.params.userId,
              setUserId: navigation.state.params.setUserId,
              removeMessageHistory: navigation.state.params.removeMessageHistory
            })
          }
        />
      )
    };
  };

  // Websocket class instance
  //websocket_uri = `ws://${manifest.debuggerHost.split(":").shift()}:3000`;
  websocket_uri = `ws://${manifest.debuggerHost
    .split(":")
    .shift()}:7000/chatbot`;
  //websocket_uri = "wss://gemuki.fokus.fraunhofer.de/chatbot";

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      connected: false,
      user_id: "",
      server_user_info: {
        _id: 2,
        name: "Chatbot",
        avatar:
          botIcon
      },
      weight_measurements: [],
      reconnectCounter: 5
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
    // Set navigation parameters (needed for passing function as callback in navigation options)
    this.props.navigation.setParams({
      // TODO: Start questionnaire
      addWeight: this.addWeight,
      startQuestionnaire: this.startQuestionnaire,
      removeMessageHistory: this.removeMessageHistory,
      setUserId: this.setUserId,
      questionnaire_stage: 0,
      weight_measurements: []
    });

    // Get messages and user name from Storage
    var messages = await this.retrieveMessages();
    var userName = await this.retrieveUserName();

    this.setState({ user_id: userName, messages: messages });

    // Go directly to settings screen if no user name was found in storage
    if (userName == "") {
      // Nagivate to user data (login) screen
      this.props.navigation.setParams({
        userId: ""
      });
      this.props.navigation.navigate("Settings");
    } else {
      this.props.navigation.setParams({
        userId: userName
      });
    }
  }

  async componentDidMount() {
    // Start websocket connection
    this.connectWebSocket();
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

  // Store user name in local storage
  storeUserName = async userName => {
    try {
      await AsyncStorage.setItem("chatbot_user_name", userName);
      console.log("Stored new user name: " + userName);
    } catch (error) {
      console.log("Error storing user name");
    }
  };

  // Retrieve user name from local storage
  retrieveUserName = async () => {
    try {
      const userName = await AsyncStorage.getItem("chatbot_user_name");
      if (userName !== null) {
        // We have data!!
        // return userName;
        return userName;
      }
    } catch (error) {
      console.log("Error retrieving user name");
    }
    return "";
  };

  // HELPER METHODS
  //_________________________

  connectWebSocket = newConversation => {
    // Create web socket instance
    this.websocket = new WebSocket(this.websocket_uri);

    // Handle openend connection
    this.websocket.onopen = async event => {
      console.log("Websocket connection opened");

      // Clear old reconnect interval
      clearInterval(this.interval);

      // Update connection state
      this.setState({ connected: true });

      // Get current push token for device
      let pushToken = await getPushToken();

      var startNewConversation = false;

      if (newConversation) {
        startNewConversation = true;
      } else {
        // Get last conversation date
        let lastInteractionDate =
          (await AsyncStorage.getItem("chatbot_last_interaction")) ||
          new Date().toString();
        lastInteractionDate = new Date(lastInteractionDate);
        let currentDate = new Date();
        let dateDifference = currentDate - lastInteractionDate;
        let dateDifferenceMinutes = Math.floor(dateDifference / 1000 / 60);
        // Return true if difference between current moment and last interaction is more than 20 minutes
        startNewConversation = dateDifferenceMinutes > 20 ? true : false;
      }

      console.log(
        "Start message to server with user name " + this.state.user_id
      );

      console.log("starting new conversation: " + startNewConversation);

      // Initial message to server
      let connectMessage = {
        type: "start",
        push_token: pushToken,
        new_conversation: startNewConversation,
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
        } else if (message["type"] == "user_data") {
          console.log("Received user data");
          if ("weight_measurements" in message) {
            console.log("Received weight measurements");
            this.setState({
              weight_measurements: message["weight_measurements"]
            });
            this.props.navigation.setParams({
              weight_measurements: message["weight_measurements"]
            });
          }
          if ("questionnaire_stage" in message) {
            console.log("Received questionnaire stage");
            this.setState({
              questionnaire_stage: message["questionnaire_stage"]
            });
            this.props.navigation.setParams({
              questionnaire_stage: message["questionnaire_stage"]
            });
          }
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
        message.user = {
          _id: this.state.user_id
        };
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
      async () => {
        // Store updated messages in local storage
        await this.storeMessages(this.state.messages);
        // Update time of last interaction
        let date = new Date();
        await AsyncStorage.setItem("chatbot_last_interaction", date.toString());
      }
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

  // Send event to server to start weight measurement dialog
  startQuestionnaire = () => {
    var event = this.createBotkitEvent("", "questionnaire");
    if (this.state.connected) {
      this.websocket.send(JSON.stringify(event));
    }
  };

  // Set new user name and reconnect
  setUserId = userId => {
    this.setState({ user_id: userId }, () => {
      this.storeUserName(userId);
      this.setState({ user_name: userId });
      this.props.navigation.setParams({
        userId: userId
      });
      this.connectWebSocket(true);
    });
  };

  // Set empty messages array in state and store empty array in storage
  removeMessageHistory = () => {
    console.log("Removing message history");
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
