import {
  Dimensions,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { LineChart } from "react-native-chart-kit";
import { useState } from "react";
import Colors from "../../constants/Colors";
import { StakeSelector } from "../../components/StakeSelector";

export default () => {
  const colorScheme = useColorScheme();

  const [selectedChart, setSelectedChart] = useState<string>("all");

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={styles.title}>チャート</Text>
          <StakeSelector val={selectedChart} setter={setSelectedChart} />
          <ChartArea />
          <Text style={styles.title}>セッション統計</Text>
          <StatsArea />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  tableRow: {
    flex: 1,
    flexDirection: "row",
    rowGap: 10,
    display: "flex",
    justifyContent: "space-between",
  },
});

const ChartArea = () => {
  const width = Dimensions.get("window").width - 2 * 20;
  const height = 440;

  return (
    <View>
      <LineChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={graphStyle}
      />
    </View>
  );
};

const StatsArea = () => {
  const width = Dimensions.get("window").width - 2 * 20;

  return (
    <View style={{ width: width, height: "auto" }}>
      <View style={styles.tableRow}>
        {summaryData.labels.map((label, index) => (
          <View
            style={{ flex: 1 / summaryData.labels.length }}
            key={`label_${index}`}
          >
            <Text>{label}</Text>
          </View>
        ))}
      </View>
      {summaryData.datasets.map((dataset, index) => (
        <View style={styles.tableRow} key={`dataset_${index}`}>
          {dataset.data.map((value, index) => (
            <View
              style={{ flex: 1 / summaryData.labels.length }}
              key={`data_${index}`}
            >
              <Text>{value}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

// Example Data

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#cccccc",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(0, 146, 146, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};
const graphStyle = {
  marginVertical: 8,
  ...chartConfig.style,
};

const data = {
  labels: [
    "12/1",
    "12/2",
    "12/3",
    "12/4",
    "12/5",
    "12/6",
    "12/7",
    "12/8",
    "12/9",
    "12/10",
    "12/11",
    "12/12",
    "12/13",
    "12/14",
    "12/15",
    "12/16",
  ],
  datasets: [
    {
      data: [
        50, 20, 2, 86, 71, 100, 520, 420, 2, 86, 71, 300, 371, 400, 471, 500,
      ],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
    },
  ],
};

const summaryData = {
  labels: ["項目", "ハンド数", "ネット", "ウィンレート"],
  datasets: [
    {
      data: ["総計", 125012, 4250, (4250 / 125012) * 100],
    },
    {
      data: ["総計", 125012, 4250, (4250 / 125012) * 100],
    },
    {
      data: ["総計", 125012, 4250, (4250 / 125012) * 100],
    },
    {
      data: ["総計", 125012, 4250, (4250 / 125012) * 100],
    },
    {
      data: ["総計", 125012, 4250, (4250 / 125012) * 100],
    },
    {
      data: ["総計", 125012, 4250, (4250 / 125012) * 100],
    },
  ],
  settings: {
    currency: "dollar",
  },
};
