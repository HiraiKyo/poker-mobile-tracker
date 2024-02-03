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
import {
  DEFAULT_STAKE,
  STAKES_CODE_ALL,
  StakeSelector,
} from "../../components/StakeSelector";
import { Stake } from "../../types/stake";
import { useData } from "../../context/dataContext";
import { SessionWithStake } from "../../types/session";
import { TextPath } from "react-native-svg";
import { DataEmpty } from "../../components/DataEmpty";

export default () => {
  const colorScheme = useColorScheme();
  const [selectedStake, setStake] = useState<Stake>(DEFAULT_STAKE);
  const { isDataEmpty } = useData();
  // データがまだない場合はデータ入力へ誘導
  if (isDataEmpty) {
    return <DataEmpty />;
  }
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>チャート</Text>
        <View style={styles.scrollItem}>
          <StakeSelector setter={setStake} />
        </View>
        <ChartArea stake={selectedStake} />
        <Text style={styles.title}>セッション統計</Text>
        <StatsArea />
      </ScrollView>
    </View>
  );
};

const sideMargin = 40;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  scrollView: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollItem: {
    width: Dimensions.get("window").width - 2 * sideMargin,
    alignContent: "center",
    gap: 4,
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

const ChartArea = ({ stake }: { stake: Stake }) => {
  const width = Dimensions.get("window").width - 2 * 20;
  const height = 440;

  const { data } = useData();

  // セッションをフィルターする
  const filterSessions = (sessions: SessionWithStake[]) => {
    if (stake.stakes_code === STAKES_CODE_ALL) {
      return sessions;
    }
    return sessions.filter(
      (session) => session.stakes_code === stake.stakes_code
    );
  };

  let temp = 0;
  const labels: string[] = filterSessions(data).map((session) => {
    temp += session.hands_amount;
    return temp.toString();
  });
  let tempData = 0;
  const datasets = [
    {
      data: filterSessions(data).map((session) => {
        tempData += session.win_amount;
        return tempData;
      }),
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
    },
  ];

  return (
    <View>
      <LineChart
        data={{
          labels,
          datasets,
        }}
        width={width}
        height={height}
        chartConfig={chartConfig}
        style={graphStyle}
      />
    </View>
  );
};

const StatsArea = () => {
  const width = Dimensions.get("window").width - 2 * 20;

  const { data, stakes } = useData();

  // セッションをフィルターする
  const filterSessions = (sessions: SessionWithStake[], stake: Stake) => {
    if (stake.stakes_code === STAKES_CODE_ALL) {
      return sessions;
    }
    return sessions.filter(
      (session) => session.stakes_code === stake.stakes_code
    );
  };

  const labels: string[] = summaryData.labels;

  const accumHands = (sessions: SessionWithStake[]) => {
    let total = 0;
    sessions.forEach((session) => {
      total += session.hands_amount;
    });
    return total;
  };
  const accumNet = (sessions: SessionWithStake[]) => {
    let total = 0;
    sessions.forEach((session) => {
      total += session.win_amount;
    });
    return total;
  };
  const accumBB = (sessions: SessionWithStake[]) => {
    let total = 0;
    sessions.forEach((session) => {
      total += session.win_amount / session.bb; // コーナーケースある？
    });
    return total;
  };

  const generateRow = (stake: Stake) => {
    const sessions = filterSessions(data, stake);
    const hands = accumHands(sessions);
    const net = accumNet(sessions);
    const bb = accumBB(sessions);
    const winrate = ((bb / hands) * 100).toFixed(1); // 小数点第１位で四捨五入
    return [stake.stakes_name, hands, net, bb, winrate];
  };
  const dataset = [
    generateRow(DEFAULT_STAKE),
    ...stakes.map((stake) => generateRow(stake)),
  ];

  return (
    <View style={{ width: width, height: "auto" }}>
      <View style={styles.tableRow}>
        {labels.map((label, index) => (
          <View
            style={{ flex: 1 / summaryData.labels.length }}
            key={`label_${index}`}
          >
            <Text>{label}</Text>
          </View>
        ))}
      </View>
      {dataset.map((row, index) => (
        <View style={styles.tableRow} key={`row_${index}`}>
          {row.map((value, index) => (
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

const summaryData = {
  labels: ["項目", "ハンド数", "ネット($)", "ネット(BB)", "ウィンレート"],
  settings: {
    currency: "dollar",
  },
};
