# Netlifyセットアップガイド - GPT & DeepL チャットボット実装

## 必要なもの
- OpenAI APIキー
- DeepL APIキー（無料版でOK）
- Netlifyアカウント（無料）

## セットアップ手順

### 1. Netlifyアカウントの作成
1. [Netlify](https://www.netlify.com/)にアクセス
2. 「Sign up」をクリックしてGitHubアカウントでサインアップ

### 2. プロジェクトのデプロイ
1. Netlifyダッシュボードで「Add new site」→「Import an existing project」をクリック
2. GitHubを選択し、`takenamishuzoten-sakelink`リポジトリを選択
3. デプロイ設定はそのままで「Deploy site」をクリック

### 3. 環境変数の設定
1. Netlifyダッシュボードで、デプロイしたサイトを選択
2. 「Site configuration」→「Environment variables」に移動
3. 以下の環境変数を追加：
   - `OPENAI_API_KEY`: OpenAI APIキー
   - `DEEPL_API_KEY`: DeepL APIキー

### 4. 再デプロイ
1. 「Deploys」タブに移動
2. 「Trigger deploy」→「Deploy site」をクリック

### 5. カスタムドメイン（オプション）
1. 「Domain management」から独自ドメインを設定可能

## ローカル開発
```bash
# Netlify CLIをインストール
npm install -g netlify-cli

# プロジェクトディレクトリで
cd takenamishuzoten_SAKElink

# 環境変数を設定（.envファイルを作成）
echo "OPENAI_API_KEY=your-api-key" > .env
echo "DEEPL_API_KEY=your-deepl-key" >> .env

# ローカルで実行
netlify dev
```

## APIキーの取得方法

### OpenAI APIキー
1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. サインインまたはアカウント作成
3. 「API keys」から新しいキーを作成

### DeepL APIキー
1. [DeepL API](https://www.deepl.com/pro-api)にアクセス
2. 無料版のアカウントを作成
3. APIキーを取得（月50万文字まで無料）

## トラブルシューティング

### エラー: AI設定が見つかりません
- Netlifyの環境変数が正しく設定されているか確認
- 再デプロイを実行

### エラー: ネットワークエラー
- Netlify Functionsが正しくデプロイされているか確認
- ブラウザのコンソールでエラーを確認

## 費用について
- Netlify: 無料枠で十分（月間125,000リクエストまで）
- OpenAI: 使用量に応じて課金（GPT-4は約$0.03/1000トークン）
- DeepL: 無料枠（月50万文字）で通常は十分