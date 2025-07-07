// AI Configuration for Takenami Shuzoten SAKElink
// 竹浪酒造店専用 AI設定ファイル

window.aiConfig = {
    // OpenAI Configuration
    openai: {
        apiKey: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE', // 環境変数またはここに設定
        model: 'gpt-4',
        maxTokens: 1000,
        temperature: 0.7
    },
    
    // DeepL Configuration
    deepl: {
        apiKey: process.env.DEEPL_API_KEY || 'YOUR_DEEPL_API_KEY_HERE', // 環境変数またはここに設定
        apiUrl: 'https://api-free.deepl.com/v2/translate'
    },
    
    // AI Chatbot Settings - 竹浪酒造店専用
    chatbot: {
        systemPrompt: `あなたは「AIさくら」です。竹浪酒造店専用のアシスタントとして、以下の役割を担います：

【竹浪酒造店について】
- 所在地: 青森県北津軽郡板柳町板柳土井113-1
- 電話: 0172-88-8030
- モットー: 「燗酒専心」
- 特徴: 岩木山の伏流水と津軽平野の米を使用した手仕事醸造
- こだわり: 米洗いから麹造り、醪、上槽まで一貫した手仕事で酒本来の味を追求

【専門知識】
1. 燗酒の専門知識と楽しみ方
2. 日本酒の基礎知識（特に燗酒重視）
3. 青森・津軽地域の特色
4. 竹浪酒造店の商品と製造法

【重要な制約】
- 竹浪酒造店の情報のみ回答する
- 他の酒蔵や企業の商品については一切言及しない
- 燗酒を中心とした日本酒の楽しみ方を提案する

回答スタイル：
- 津軽弁は使わず標準語で親しみやすく
- 燗酒の魅力を積極的にPR
- 青森・津軽の文化も交えて説明
- 絵文字（🌸🍶❄️🗻）を適度に使用`,
        
        welcomeMessage: 'こんにちは！AIさくらです🌸\n竹浪酒造店と燗酒について何でもお聞きください！',
        
        fallbackMessage: '申し訳ございません。竹浪酒造店に関することでしたら、別の表現で質問していただけますか？🌸',
        
        supportedLanguages: [
            { code: 'ja', name: '日本語' },
            { code: 'en', name: 'English' },
            { code: 'zh-cn', name: '简体中文' },
            { code: 'zh-tw', name: '繁體中文' },
            { code: 'ko', name: '한국어' },
            { code: 'th', name: 'ไทย' },
            { code: 'vi', name: 'Tiếng Việt' },
            { code: 'fr', name: 'Français' },
            { code: 'es', name: 'Español' },
            { code: 'de', name: 'Deutsch' },
            { code: 'it', name: 'Italiano' },
            { code: 'pt', name: 'Português' }
        ]
    },
    
    // Company Configuration - 竹浪酒造店専用
    company: {
        id: 'takenami_shuzoten',
        name: '竹浪酒造店',
        businessType: 'sake',
        knowledgeBase: {
            company: {
                name: '竹浪酒造店',
                location: '青森県北津軽郡板柳町',
                address: '〒038-3662 青森県北津軽郡板柳町板柳土井113-1',
                phone: '0172-88-8030',
                motto: '燗酒専心',
                description: '岩木山の伏流水と津軽平野の米を使用し、米洗いから麹造り、醪、上槽まで一貫した手仕事で酒本来の味を追求する青森の酒蔵',
                features: ['岩木山伏流水', '津軽平野の米', '手仕事醸造', '燗酒専心'],
                specialties: ['燗酒', '純米大吟醸', '生原酒', '普通酒'],
                philosophy: '燗酒を本義として醸している',
                water: '岩木山の伏流水',
                rice: '津軽平野の米',
                process: '米洗いから麹造り、醪、上槽まで一貫した手仕事'
            },
            products: [
                {
                    name: '純米大吟醸',
                    type: '純米大吟醸酒',
                    description: '最高級の津軽平野の米を使用し、丁寧に醸造した純米大吟醸酒。燗酒でも冷酒でもお楽しみいただけます。',
                    features: ['津軽平野の米', '燗酒対応', '冷酒対応']
                },
                {
                    name: '生原酒',
                    type: '生原酒',
                    description: '火入れをしない生の原酒。フレッシュで力強い味わいが特徴です。',
                    features: ['火入れなし', 'フレッシュ', '力強い味わい']
                },
                {
                    name: '普通酒',
                    type: '普通酒',
                    description: '日常酒として親しまれている普通酒。燗酒にして本領を発揮する味わいです。',
                    features: ['日常酒', '燗酒推奨', '本領発揮']
                }
            ],
            regions: {
                aomori: '青森県は本州最北端の県で、厳しい寒さと豊かな自然に恵まれています',
                tsugaru: '津軽平野は青森県西部の平野で、良質な米の産地として知られています',
                itayanagi: '板柳町は津軽平野の中央部に位置し、農業が盛んな町です',
                iwakisan: '岩木山は津軽富士とも呼ばれる青森県の象徴的な山で、良質な伏流水の源です'
            }
        },
        allowedTopics: [
            '竹浪酒造店', '燗酒', '青森', '津軽', '板柳町', '岩木山', '日本酒',
            '純米大吟醸', '生原酒', '普通酒', '手仕事', '伏流水', '津軽平野'
        ],
        blockedCompanies: ['他社', '他の酒蔵', '競合', '別の蒸留所', '他のワイナリー']
    },
    
    // Quick Reply Templates - 竹浪酒造店専用
    quickReplies: {
        takenami: [
            '竹浪酒造店について教えて',
            '燗酒の楽しみ方を教えて',
            'おすすめのお酒を教えて',
            '青森の地酒の特徴は？',
            '蔵見学はできますか？',
            '津軽平野の米について',
            '岩木山の水について',
            '手仕事醸造とは？'
        ],
        sake_general: [
            '燗酒の温度について',
            '日本酒の種類を教えて',
            '純米酒と普通酒の違い',
            '日本酒の保存方法',
            '燗酒に合う料理',
            'お酒の選び方'
        ]
    },
    
    // Error Messages
    errorMessages: {
        apiError: 'AIサービスに一時的な問題が発生しています。しばらくお待ちください。',
        networkError: 'ネットワーク接続に問題があります。接続を確認してください。',
        rateLimitError: 'しばらく時間をおいてから再度お試しください。',
        unknownError: '予期しないエラーが発生しました。ページを再読み込みしてください。',
        outOfScope: '申し訳ございませんが、竹浪酒造店に関する質問にのみお答えできます。🌸'
    }
};

// 竹浪酒造店専用の企業分離チェック
window.companyFilter = {
    isAllowedTopic: function(question) {
        const allowedTopics = window.aiConfig.company.allowedTopics;
        const blockedCompanies = window.aiConfig.company.blockedCompanies;
        
        // 許可されたトピックのチェック
        const hasAllowedTopic = allowedTopics.some(topic => 
            question.toLowerCase().includes(topic.toLowerCase())
        );
        
        // ブロックされた企業名のチェック
        const hasBlockedCompany = blockedCompanies.some(company => 
            question.toLowerCase().includes(company.toLowerCase())
        );
        
        return hasAllowedTopic && !hasBlockedCompany;
    },
    
    filterResponse: function(response) {
        const blockedCompanies = window.aiConfig.company.blockedCompanies;
        
        // 他社名が含まれていないかチェック
        for (let company of blockedCompanies) {
            if (response.toLowerCase().includes(company.toLowerCase())) {
                return window.aiConfig.errorMessages.outOfScope;
            }
        }
        
        return response;
    }
};

// 設定の妥当性チェック
function validateConfig() {
    const config = window.aiConfig;
    
    if (!config.openai.apiKey || config.openai.apiKey === 'your-openai-api-key-here') {
        console.warn('OpenAI API key is not configured');
    }
    
    if (!config.deepl.apiKey || config.deepl.apiKey === 'your-deepl-api-key-here') {
        console.warn('DeepL API key is not configured');
    }
    
    console.log('Takenami Shuzoten AI Configuration loaded successfully');
    console.log('Company:', config.company.name);
    console.log('Business Type:', config.company.businessType);
}

// 設定の初期化
document.addEventListener('DOMContentLoaded', validateConfig);