# poker-mobile-tracker
モバイルアプリ向けポーカー収支管理アプリ

# ディレクトリ構成
`docs`: ドキュメント類

# 環境立ち上げ
`npx expo start`

# スタック
DB: Expo-SQLite
App: Expo React Native

# FIXME:
## Modalを開いた時に、Backボタンがホームにしか戻れない
inprovements pendingって書いてある？

https://docs.expo.dev/router/reference/faq/

Backsheet Modalにして対応する事が求められてそう

# TROUBLESHOOTING

## Expoアプリ起動時

- nodejs17+だとどうこう出てくる。

`npx create-expo app pmt --template` で回避

## `Metro has encountered an error: While trying to resolve module 'react-hook-form' from file: ...`

https://github.com/infinitered/ignite/issues/1995

MJSを許可する事で解決。アプリリロード必須


# MEMO

## SQLiteBrowser
`sudo apt-get install sqlitebrowser`

