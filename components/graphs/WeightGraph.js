import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

class WeightGraph extends Component {
  render() {
    return (
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>
          Dein Gewichtsverlauf
        </Text>
        <LineChart
          data={{
            labels: ["Januar", "Februar", "März", "April", "Mai", "Juni"],
            datasets: [
              {
                data: [60, 63, 69, 77, 85, 92]
              },

              // If problem with disablePoints variable: Go to react-native-chart-kit in node modules and add following code to src/line-chart.js
              // Disable rendering of data points
              //   if (dataset.disablePoints) {
              //     return;
              //   }
              {
                data: [50, 60, 70, 80, 90, 100],
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                disablePoints: true
              }
            ]
          }}
          width={Dimensions.get("window").width - 20} // from react-native
          height={220}
          // yAxisLabel={"kg"}
          onDataPointClick={(value, dataset, getColor) => {
            alert(value);
          }}
          chartConfig={{
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
          }}
          //bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    );
  }
}

export default WeightGraph;
