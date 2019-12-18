import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";

class GoalsGraph extends Component {
  render() {
    const commitsData = [
      { date: "2017-01-02", count: 1 },
      { date: "2017-01-03", count: 2 },
      { date: "2017-01-04", count: 3 },
      { date: "2017-01-05", count: 4 },
      { date: "2017-01-06", count: 5 },
      { date: "2017-01-30", count: 2 },
      { date: "2017-01-31", count: 3 },
      { date: "2017-03-01", count: 2 },
      { date: "2017-04-02", count: 4 },
      { date: "2017-03-05", count: 2 },
      { date: "2017-02-30", count: 4 }
    ];


    const chartConfig = {
      backgroundColor: "#3966FB",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 1, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "1",
        stroke: "#ffa726"
      }
    }

    return (
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
          Deine Erfolge
        </Text>
        <ContributionGraph
          values={commitsData}
          endDate={new Date("2017-04-01")}
          numDays={105}
          width={Dimensions.get("window").width -20}
          height={220}
          chartConfig={chartConfig}
        />
      </View>
    );
  }
}

export default GoalsGraph;
