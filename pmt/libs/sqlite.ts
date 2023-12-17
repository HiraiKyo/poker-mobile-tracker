import { SQLTransaction, SQLiteDatabase, openDatabase as openSQLDatabase } from "expo-sqlite";
import { documentDirectory, downloadAsync, getInfoAsync, makeDirectoryAsync } from "expo-file-system";
import { Asset } from "expo-asset";
import { Platform } from "react-native";

/**
 * DB読込
 * @param pathToDatabaseFile 
 * @returns 
 */
export const openDatabase = async (pathToDatabaseFile: string): Promise<SQLiteDatabase> => {
  // ネイティブならファイルシステムで読込
  if(Platform.OS === "android" || Platform.OS === "ios"){
    if (!(await getInfoAsync(documentDirectory + 'SQLite')).exists) {
      await makeDirectoryAsync(documentDirectory + 'SQLite');
    }
  }
  // TODO: WebならlocalStorageから読込
  if(Platform.OS === "web"){

  }
  // FIXME: ダウンロード処理
  // await downloadAsync(
  //   Asset.fromModule(require(pathToDatabaseFile)).uri,
  //   documentDirectory + 'SQLite/myDatabase.db'
  // );
  return openSQLDatabase('myDatabase.db');
}

/**
 * DB初期化トランザクション
 */
export const initTransaction = (tx: SQLTransaction) => {
  tx.executeSql(
    "create table if not exists items (id integer primary key not null, done int, value text);"
  );
}