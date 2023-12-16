import { Button, Pressable, ScrollView, StyleSheet, useColorScheme } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Link } from 'expo-router';
import { ReactNode } from 'react';

export default () => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ alignItems: "center", flex: 1}}>
          <Text style={styles.title}>セッション一覧</Text>
          <View style={{ justifyContent: "center", gap: 4}}>
            <RoundedLabel backgroundColor="lightblue"><Text style={[styles.sessionDateSeparator, {color: Colors[colorScheme ?? 'light'].text}]}>今日</Text></RoundedLabel>
            <RoundedLabel backgroundColor="lightblue">
              <SessionSummary />
            </RoundedLabel>
            <RoundedLabel backgroundColor="lightblue">
              <SessionSummary />
            </RoundedLabel>   
            <RoundedLabel backgroundColor="lightblue">
              <SessionSummary />
            </RoundedLabel>   
            <RoundedLabel backgroundColor="lightblue">
              <SessionSummary />
            </RoundedLabel>   
            <RoundedLabel backgroundColor="lightblue">
              <SessionSummary />
            </RoundedLabel>   
            <RoundedLabel backgroundColor="lightblue">
              <SessionSummary />
            </RoundedLabel>
            <RoundedLabel backgroundColor="lightblue"><Text style={[styles.sessionDateSeparator, {color: Colors[colorScheme ?? 'light'].text}]}>昨日</Text></RoundedLabel>            
            <RoundedLabel backgroundColor="lightblue">
              <SessionSummary />
            </RoundedLabel>
            <Pressable>
              {({ pressed }) => (
                <RoundedLabel backgroundColor={Colors[colorScheme ?? 'light'].tint}>
                  <Text style={{color: Colors[colorScheme ?? "light"].text}}>もっと見る...</Text>
                </RoundedLabel>
              )}
          </Pressable>
          </View>
        </View>
      </ScrollView>
      {/** 新しいセッション追加ボタン */}
      <Link href="/modal" style={styles.buttonStyle}>
        <Pressable>
          {({ pressed }) => (
            <CircleBorder size={66} borderWidth={0} borderColor="black" backgroundColor={Colors[colorScheme ?? 'light'].tint}>
              <FontAwesome
                name="plus"
                size={35}
                color={Colors[colorScheme ?? 'light'].text}
                style={[ { opacity: pressed ? 0.5 : 1 }]}
              />
            </CircleBorder>
          )}
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  // セッション一覧用
  sessionDateSeparator: {
    fontSize: 12,
  },
});

/** === 単発コンポーネント === */

/**
 * セッションコンポーネント
 * TODO: 横幅がなぜか画面幅準拠にならない。横幅どうするか？
 * TODO: 長い時に折り返しするように
 */
const SessionSummary = () => {
  const colorScheme = useColorScheme();

  return (
    <div style={{flex: 1}}>
      <div style={{rowGap: 10, display: "flex", flexDirection: "row", justifyContent: "space-between", flex: 1}}>
        {/** Stakes, Poker Sites, Date, Time */}
        <Text style={{fontSize: 18}}>KKPoker</Text>
        <Text style={{fontSize: 18, marginStart: 20}}>$100-$500 Flash</Text>
        <span style={{flex: 1}}></span>
        <Text style={{fontSize: 12}}>2023/12/16 13:25:11</Text>
      </div>
      <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", flex: 1}}>
        {/** Hands, Won BB, Won Chips*/}
        <Text style={{fontSize: 18, fontWeight: "500"}}>1211 Hands</Text>
        <Text style={{fontSize: 18, fontWeight: "500", color: "green"}}>+121 BB (+605 $)</Text>
      </div>
    </div>
  )
}

/**
 * 丸枠テキスト
 */
const RoundedLabel = ({ backgroundColor, children }: { backgroundColor: string, children: ReactNode }) => {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
      <View style={{
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor
      }}>
          {children}
      </View>
    </View>
  )
}

/**
 * 円形アイコン
 * @param param0 
 * @returns 
 */
const CircleBorder = ({ size, borderWidth, borderColor, backgroundColor, children }: {size: number, borderWidth: number, borderColor: string, backgroundColor: string, children: ReactNode}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: 0.5 * size,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor,
      borderWidth,
      backgroundColor
    }}>
    {children}
  </View>
);