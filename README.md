# poker-mobile-tracker

モバイルアプリ向けポーカー収支管理アプリ

# ディレクトリ構成

- `docs`: ドキュメント類
- `pmt`: アプリソース

# 環境立ち上げ

`npx expo start --tunnel`

# スタック

- DB: Expo-SQLite
- App Framework: Expo React Native
- UI Materals: ui-kitten

# 要修正項目

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
