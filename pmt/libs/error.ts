import { SQLError } from "expo-sqlite";

/**
 * エラー管理クラス
 */
export class AppError {
  private static instance: AppError;
  constructor() {}

  // シングルトン化
  static getInstance = () => {
    if (!this.instance) {
      this.instance = new AppError();
    }
    return this.instance;
  };

  /**
   * SQLiteトランザクションエラー
   * @param error
   * @returns
   */
  transactionError = (error: SQLError) => {
    console.error(error);
    return true; // Expo-SQLiteはErrorCallbackにbooleanを返す必要あり。
  };
}
