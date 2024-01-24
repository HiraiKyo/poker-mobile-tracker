# poker-mobile-tracker

モバイルアプリ向けポーカー収支管理アプリ

# スタック

- DB: Expo-SQLite
- App Framework: Expo React Native
- UI Materals: ui-kitten

# ディレクトリ構成

- `docs`: ドキュメント類
- `pmt`: アプリソース

# 環境立ち上げ

## 開発環境テスト

`npx expo start --tunnel`

# 要修正項目

## SQLite の日付型変換

SQLite は日付型がないので、Datetime <-> String 変換を用意する必要あり

# TROUBLESHOOTING

## Expo アプリ起動時

- nodejs17+だとどうこう出てくる。

`npx create-expo app pmt --template` で回避

## `Metro has encountered an error: While trying to resolve module 'react-hook-form' from file: ...`

https://github.com/infinitered/ignite/issues/1995

MJS を許可する事で解決。アプリリロード必須

# MEMO

## SQLiteBrowser

`sudo apt-get install sqlitebrowser`

## Cycled Dependency 問題

循環参照どうするか？ Inversify で DI する？
でも Interface 書くのは面倒だなあ

# Improvements

## SQLite の ORM 入れたい

TypeORM 入れられる？
