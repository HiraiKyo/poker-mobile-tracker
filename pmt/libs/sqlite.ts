import {
  SQLError,
  SQLResultSet,
  SQLResultSetRowList,
  SQLTransaction,
  SQLiteDatabase,
  openDatabase as openSQLDatabase,
} from "expo-sqlite";
import {
  deleteLegacyDocumentDirectoryAndroid,
  documentDirectory,
  downloadAsync,
  getInfoAsync,
  makeDirectoryAsync,
} from "expo-file-system";
import { Platform } from "react-native";
import Config from "../constants/Config";
// import { appError } from "../app/_layout";
import { Session, SessionWithStake } from "../types/session";
import { Stake } from "../types/stake";

/**
 * Repositoryクラス
 * TODO: DBの変更通知を出して、プレゼンテーション層でデータ再取得させる
 */
export class Database {
  private static instance: Database;
  private db: SQLiteDatabase;
  constructor() {
    this.db = new SQLiteDatabase(Config.db.defaultFileName);
  }

  // Singleton化
  static async getInstance() {
    if (!this.instance) {
      this.instance = new Database();

      // DB読込
      this.instance.db = await this.instance.openDatabase("");

      // DB存在しない場合に初期化 FIXME: 同期的に初期化した方がいい？
      await this.instance.initialize();
    }
    return this.instance;
  }

  /**
   * DB読込
   * @param pathToDatabaseFile
   * @returns
   */
  private openDatabase = async (
    pathToDatabaseFile: string
  ): Promise<SQLiteDatabase> => {
    // ネイティブならファイルシステムで読込
    if (Platform.OS === "android" || Platform.OS === "ios") {
      if (!(await getInfoAsync(documentDirectory + "SQLite")).exists) {
        await makeDirectoryAsync(documentDirectory + "SQLite");
      }
    }
    // FIXME: Web版はexpo-sqliteが対応していないので、後から考える
    if (Platform.OS === "web") {
    }
    // FIXME: ダウンロード処理
    // await downloadAsync(
    //   Asset.fromModule(require(pathToDatabaseFile)).uri,
    //   documentDirectory + 'SQLite/myDatabase.db'
    // );
    return await openSQLDatabase(Config.db.defaultFileName);
  };

  /**
   * DB初期化
   * @returns
   */
  private initialize = (onLoaded: () => void = () => {}) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `
          CREATE TABLE IF NOT EXISTS stakes (
            stakes_code	INTEGER NOT NULL,
            stakes_name	TEXT NOT NULL,
            sb INTEGER NOT NULL,
            bb INTEGER NOT NULL,
            provider TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            deleted_at TEXT,
            PRIMARY KEY(stakes_code)
          );
          `,
        [],
        (tx, resultSet) => {},
        (tx, e) => {
          return false;
        }
      );
    });
    this.db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TEXT,
          session_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          hands_amount INTEGER NOT NULL,
          stakes_code	INTEGER NOT NULL,
          win_amount INTEGER NOT NULL,
          FOREIGN KEY(stakes_code) REFERENCES stakes(stakes_code),
          PRIMARY KEY(id)
        );
          `,
        [],
        (tx, resultSet) => {
          onLoaded();
        },
        (tx, e) => {
          return false;
        }
      );
    });
  };

  /**
   * セッション追加
   * @param session
   */
  public insertSession = (
    session: Omit<Session, "id" | "created_at" | "updated_at" | "deleted_at">,
    onSuccess: (sessionWithStakes: SessionWithStake[]) => void,
    onFailed: () => void
  ) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `
        INSERT INTO "sessions" (
          "session_at", "hands_amount", "stakes_code", "win_amount"
        )
        VALUES (
          ?, ?, ?, ?
        );`,
        [
          session.session_at.toISOString(),
          session.hands_amount,
          session.stakes_code,
          session.win_amount,
        ],
        (tx, resultSet) => {
          console.log(resultSet);
          onSuccess(this.convertSessionList(resultSet.rows._array));
        },
        (tx, e) => {
          onFailed();
          console.error(e);
          return false;
          // return appError.transactionError(e);
        }
      );
    });
  };

  /**
   * セッション更新
   * @param session
   */
  public updateSession = (session: Session, onLoaded: () => void) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `
        UPDATE "sessions"
        SET
          updated_at = CURRENT_TIME,
          session_at = ?,
          hands_amount = ?,
          stakes_code = ?,
          win_amount = ?
        WHERE id = ?;
        `,
        [
          session.session_at.toISOString(),
          session.hands_amount,
          session.stakes_code,
          session.win_amount,
          session.id,
        ],
        (tx, resultSet) => console.log(resultSet),
        (tx, e) => {
          console.error(e);
          return false;
          // return appError.transactionError(e);
        }
      );
    });
  };

  /**
   * セッション一括削除
   * @param sessions
   */
  public deleteManySessions = (sessions: Session[], onLoaded: () => void) => {
    let ids: number[] = [];
    let separator = "";
    let placeholders = "(";
    for (let session of sessions) {
      placeholders += separator + "?";
      separator = ", ";
      ids.push(session.id);
    }
    placeholders += ");";

    this.db.transaction((tx) => {
      tx.executeSql(
        `
        DELETE FROM sessions
        WHERE id IN ${placeholders}
      `,
        ids,
        (tx, resultSet) => onLoaded,
        (tx, e) => {
          console.error(e);
          return false;
          // return appError.transactionError(e);
        }
      );
    });
  };

  /**
   * データ読込
   * @param onLoaded
   */
  public loadSession = (onLoaded: (list: SessionWithStake[]) => unknown) => {
    this.db.readTransaction((tx) => {
      tx.executeSql(
        `
        SELECT sessions.*, stakes.stakes_name, stakes.sb, stakes.bb, stakes.provider FROM sessions INNER JOIN stakes ON sessions.stakes_code = stakes.stakes_code;
      `,
        [],
        (tx, resultSet) => {
          console.log(resultSet);
          onLoaded(this.convertSessionList(resultSet.rows._array));
        },
        (tx, e) => {
          console.error(e);
          return false;
          // return appError.transactionError(e);
        }
      );
    });
  };

  /** ステークス管理 */

  /**
   * ステークス追加
   * @param stake
   */
  public insertStake = (
    stake: Omit<
      Stake,
      "stakes_code" | "created_at" | "updated_at" | "deleted_at"
    >,
    onSuccess: (stake: Stake) => void,
    onFailed: () => void
  ) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `
          INSERT INTO "stakes" (
            "stakes_name", "sb", "bb", "provider"
          )
          VALUES (
            ?, ?, ?, ?
          );`,
        [stake.stakes_name, stake.sb, stake.bb, stake.provider],
        (tx, resultSet) => {
          console.log(resultSet);
          if (!resultSet.insertId) {
            onFailed();
            return;
          }
          onSuccess({
            stakes_code: resultSet.insertId,
            ...resultSet.rows.item(0),
          });
        },
        (tx, e) => {
          onFailed();
          console.error(e);
          return false;
          // return appError.transactionError(e);
        }
      );
    });
  };

  /**
   * ステークス更新
   * @param stake
   */
  public updateStake = (
    stake: Stake,
    onSuccess: () => void,
    onFailed: () => void
  ) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `
          UPDATE "stakes"
          SET
            updated_at = CURRENT_TIME,
            stakes_name = ?,
            sb = ?,
            bb = ?,
            provider = ?
          WHERE stakes_code = ?;
          `,
        [
          stake.stakes_name,
          stake.sb,
          stake.bb,
          stake.provider,
          stake.stakes_code,
        ],
        (tx, resultSet) => {
          console.log(resultSet);
          onSuccess();
        },
        (tx, e) => {
          onFailed();
          console.error(e);
          return false;
          // return appError.transactionError(e);
        }
      );
    });
  };

  /**
   * ステークス一括削除
   * @param stakes
   */
  public deleteManyStakes = (
    stakes: Stake[],
    onSuccess: () => void,
    onFailed: () => void
  ) => {
    let ids: number[] = [];
    let separator = "";
    let placeholders = "(";
    for (let stake of stakes) {
      placeholders += separator + "?";
      separator = ", ";
      ids.push(stake.stakes_code);
    }
    placeholders += ");";

    this.db.transaction((tx) => {
      tx.executeSql(
        `
          DELETE FROM stakes
          WHERE stakes_code IN ${placeholders}
        `,
        ids,
        (tx, resultSet) => {
          console.log(resultSet);
          onSuccess();
        },
        (tx, e) => {
          onFailed();
          console.error(e);
          return false;
          // return appError.transactionError(e);
        }
      );
    });
  };

  /**
   * ステークスデータ読込
   * @param onLoaded
   */
  public loadStake = (onLoaded: (list: Stake[]) => unknown) => {
    this.db.transaction((tx) => {
      tx.executeSql(
        `
          SELECT * FROM stakes;
        `,
        [],
        (tx, resultSet) =>
          onLoaded(this.convertStakeList(resultSet.rows._array)),
        (tx, e) => {
          console.error(e);
          return false;
          // return appError.transactionError(e);
        }
      );
    });
  };

  /**
   * データベースリセット
   */
  public resetAll = (onLoaded: () => void = () => {}) => {
    this.db.transaction((tx) => {
      tx.executeSql(`DROP TABLE IF EXISTS sessions;`);
      tx.executeSql(`DROP TABLE IF EXISTS stakes;`);
    });
    this.initialize(onLoaded);
  };

  /**
   * DAOはいったんここに書く
   */

  private convertSessionList = (dataList: any[]): SessionWithStake[] => {
    let output: SessionWithStake[] = [];
    for (let dataObject of dataList) {
      output.push(this.convertSession(dataObject));
    }
    return output;
  };

  private convertSession = (dataObject: any): SessionWithStake => {
    // FIXME: 書き方不明、型安全を優先してベタ書き
    const session: SessionWithStake = {
      id: dataObject["id"],
      created_at: new Date(dataObject["created_at"]),
      updated_at: new Date(dataObject["updated_at"]),
      deleted_at: new Date(dataObject["deleted_at"]),
      session_at: new Date(dataObject["session_at"]),
      hands_amount: dataObject["hands_amount"],
      stakes_code: dataObject["stakes_code"],
      win_amount: dataObject["win_amount"],
      stakes_name: dataObject["stakes_name"],
      sb: dataObject["sb"],
      bb: dataObject["bb"],
      provider: dataObject["provider"],
    };
    return session;
  };

  private convertStakeList = (dataList: any[]): Stake[] => {
    let output: Stake[] = [];
    for (let dataObject of dataList) {
      output.push(this.convertStake(dataObject));
    }
    return output;
  };

  private convertStake = (dataObject: any): Stake => {
    // FIXME: 書き方不明、型安全を優先してベタ書き
    const stake: Stake = {
      created_at: new Date(dataObject["created_at"]), // ISOStringで来る事を期待
      updated_at: new Date(dataObject["updated_at"]),
      deleted_at: new Date(dataObject["deleted_at"]),
      stakes_code: dataObject["stakes_code"],
      stakes_name: dataObject["stakes_name"],
      sb: dataObject["sb"],
      bb: dataObject["bb"],
      provider: dataObject["provider"],
    };
    return stake;
  };
}
