import { StatusBar } from 'expo-status-bar';
import { Button, Dimensions, Platform, Pressable, ScrollView, StyleSheet, TextInput, useColorScheme } from 'react-native';

import { Text, View } from '../components/Themed';
import { Controller, useForm } from 'react-hook-form';
import Colors from '../constants/Colors';

export default () => {
  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <FormArea />

          {/* Use a light status bar on iOS to account for the black space above the modal */}
          <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  line: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width
  },
  label: {
    color: 'white',
    margin: 5,
    marginLeft: 0
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  }
});

const FormArea = () => {
  const colorScheme = useColorScheme();

  const { control, handleSubmit, formState: { errors} } = useForm({
    defaultValues: {
      datetime: "",
      net: 0
    }
  }); 
  const onSubmit = (data: any) => console.log(data);

  return (
    <View style={styles.container}>
      {/** セッション終了時刻 */}
      <View
        style={styles.line}
      >
        <View style={{ flex: 0.4, alignItems: "flex-end"}}>
          <Text style={{ fontSize: 24, color: Colors[colorScheme ?? "light"].text, textAlign: "right" }}>セッション{"\n"}終了時刻</Text>
        </View>
        <View style={{ flex: 0.6 }}> 
          <Controller
            control={control}
            name="datetime"
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value }}) => (
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                  flex: 1,
                  width: '80%',
                  fontSize: 24,
                  marginLeft: '4%',
                  marginVertical: '2%',
                  color: Colors[colorScheme ?? "light"].text
                }}
                placeholder="20xx/xx/xx xx:xx:xx"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
          />
          {errors.datetime && errors.datetime.type === 'required' && (
            <Text style={{color: 'red'}}>日付は必須です。</Text>
          )}
          {errors.datetime && errors.datetime.type === 'maxLength' && (
            <Text style={{color: 'red'}}>
              Nameは10文字以内で入力してください。
            </Text>
          )}
        </View>
      </View>

      { /** 勝ち額 */}
      <View
        style={styles.line}
      >
        <View style={{ flex: 0.4, alignItems: "flex-end"}}>
          <Text style={{ fontSize: 24, color: Colors[colorScheme ?? "light"].text}}>勝ち額</Text>
          </View>
        <View style={{ flex: 0.6 }}> 
          <Controller
            control={control}
            name="net"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value }}) => (
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                  width: '80%',
                  fontSize: 24,
                  marginLeft: '4%',
                  marginVertical: '2%',
                  color: Colors[colorScheme ?? "light"].text
                }}
                placeholder="1520"
                onBlur={onBlur}
                onChangeText={(value) => onChange(parseInt(value))}
                value={value.toString()}
              />
            )}
          />
          {errors.datetime && errors.datetime.type === 'required' && (
            <Text style={{color: 'red'}}>勝ち額は必須です。</Text>
          )}
          {errors.datetime && errors.datetime.type === 'maxLength' && (
            <Text style={{color: 'red'}}>
              Nameは10文字以内で入力してください。
            </Text>
          )}
        </View>
      </View>


      <View style={[styles.button, { backgroundColor: Colors[colorScheme ?? "light"].mainBg }]}>
        <Pressable onPress={handleSubmit(onSubmit)}>
          {({ pressed }) => (
            <Text style={{ color: Colors[colorScheme ?? "light"].text, fontSize: 32}}>新規追加</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}