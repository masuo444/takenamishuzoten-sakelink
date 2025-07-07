// AI Chatbot for Takenami Shuzoten SAKElink
// 竹浪酒造店専用AIチャットボット

class AIChatbot {
    constructor() {
        this.config = window.aiConfig;
        this.companyManager = window.companyManager;
        this.isOpen = false;
        this.isTyping = false;
        this.conversationHistory = [];
        this.currentLanguage = 'ja';
        
        this.initializeElements();
        this.bindEvents();
        this.setupQuickReplies();
    }
    
    /**
     * DOM要素の初期化
     */
    initializeElements() {
        this.chatButton = document.getElementById('chatButton');
        this.chatInterface = document.getElementById('chatInterface');
        this.chatClose = document.getElementById('chatClose');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.quickReplies = document.getElementById('quickReplies');
    }
    
    /**
     * イベントの設定
     */
    bindEvents() {
        // チャットボタンクリック
        this.chatButton?.addEventListener('click', () => this.toggleChat());
        
        // 閉じるボタン
        this.chatClose?.addEventListener('click', () => this.closeChat());
        
        // 送信ボタン
        this.sendButton?.addEventListener('click', () => this.sendMessage());
        
        // Enterキーで送信
        this.messageInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // クイックリプライ
        this.quickReplies?.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply-btn')) {
                const message = e.target.getAttribute('data-message');
                this.sendQuickReply(message);
            }
        });
    }
    
    /**
     * クイックリプライの設定
     */
    setupQuickReplies() {
        if (!this.quickReplies) return;
        
        const replies = this.config?.quickReplies?.takenami || [
            '竹浪酒造店について教えて',
            '燗酒の楽しみ方を教えて',
            'おすすめのお酒を教えて',
            '青森の地酒の特徴は？'
        ];
        
        this.quickReplies.innerHTML = replies.map(reply => 
            `<button class="quick-reply-btn" data-message="${reply}">${reply}</button>`
        ).join('');
    }
    
    /**
     * チャット開閉
     */
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    /**
     * チャットを開く
     */
    openChat() {
        this.isOpen = true;
        this.chatInterface?.classList.add('open');
        this.chatButton?.classList.add('active');
        
        // 初回メッセージ表示
        if (this.conversationHistory.length === 0) {
            this.showWelcomeMessage();
        }
        
        // フォーカス
        setTimeout(() => {
            this.messageInput?.focus();
        }, 300);
    }
    
    /**
     * チャットを閉じる
     */
    closeChat() {
        this.isOpen = false;
        this.chatInterface?.classList.remove('open');
        this.chatButton?.classList.remove('active');
    }
    
    /**
     * ウェルカムメッセージ表示
     */
    showWelcomeMessage() {
        const welcomeMsg = this.config?.chatbot?.welcomeMessage || 
            'こんにちは！AIさくらです🌸\n竹浪酒造店と燗酒について何でもお聞きください！';
        
        this.addMessage(welcomeMsg, 'ai');
    }
    
    /**
     * メッセージ送信
     */
    async sendMessage() {
        const message = this.messageInput?.value?.trim();
        if (!message || this.isTyping) return;
        
        // ユーザーメッセージを表示
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // 企業フィルターチェック
        if (!this.companyManager?.isAllowedQuestion(message)) {
            const outOfScopeMsg = this.companyManager?.getOutOfScopeResponse() || 
                '申し訳ございませんが、竹浪酒造店に関する質問にのみお答えできます🌸';
            this.addMessage(outOfScopeMsg, 'ai');
            return;
        }
        
        // AI回答を取得
        await this.getAIResponse(message);
    }
    
    /**
     * クイックリプライ送信
     */
    sendQuickReply(message) {
        this.messageInput.value = message;
        this.sendMessage();
    }
    
    /**
     * AI回答取得
     */
    async getAIResponse(userMessage) {
        this.showTypingIndicator();
        
        try {
            // 竹浪酒造店の知識ベースから回答を生成
            let response = await this.generateContextualResponse(userMessage);
            
            // GPT-4 APIが利用可能な場合は使用（APIキーが空の場合は内蔵応答を使用）
            if (this.config?.openai?.apiKey && this.config.openai.apiKey !== '' && this.config.openai.apiKey !== 'your-openai-api-key-here') {
                response = await this.getGPTResponse(userMessage) || response;
            }
            
            // 企業フィルターを適用
            response = this.companyManager?.filterResponse(response) || response;
            
            // 多言語対応
            if (this.currentLanguage !== 'ja') {
                response = await this.translateResponse(response, this.currentLanguage);
            }
            
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
            
        } catch (error) {
            console.error('AI response error:', error);
            this.hideTypingIndicator();
            
            const errorMsg = this.config?.errorMessages?.apiError || 
                'AIサービスに一時的な問題が発生しています。しばらくお待ちください。';
            this.addMessage(errorMsg, 'ai');
        }
    }
    
    /**
     * コンテキスト応答生成
     */
    generateContextualResponse(message) {
        const lowerMessage = message.toLowerCase();
        const knowledge = this.companyManager?.knowledgeBase;
        
        if (!knowledge) {
            return 'お答えできませんでした。別の質問をお試しください🌸';
        }
        
        // 竹浪酒造店について
        if (lowerMessage.includes('竹浪') || lowerMessage.includes('酒蔵') || lowerMessage.includes('について')) {
            return `竹浪酒造店は青森県板柳町にある酒蔵です🍶\n\n【特徴】\n・モットー：燗酒専心\n・水：岩木山の伏流水\n・米：津軽平野の良質な米\n・製法：手仕事による一貫醸造\n\n燗酒を本義として、酒本来の味を追求しています🌸`;
        }
        
        // 燗酒について
        if (lowerMessage.includes('燗酒') || lowerMessage.includes('温め') || lowerMessage.includes('燗')) {
            return `燗酒は竹浪酒造店の専門分野です🍶\n\n【燗酒の魅力】\n・香りが立ち、まろやかな味わいに\n・体が温まり、料理との相性◎\n・日本酒本来の味わいを楽しめます\n\n【温度の目安】\n・ぬる燗：40℃前後\n・上燗：45℃前後\n・熱燗：50℃前後\n\n竹浪酒造店のお酒は燗酒にして本領を発揮します🌸`;
        }
        
        // 商品について
        if (lowerMessage.includes('商品') || lowerMessage.includes('お酒') || lowerMessage.includes('おすすめ')) {
            return `竹浪酒造店のお酒をご紹介します🍶\n\n【七郎兵衛シリーズ】\n・特別純米酒（¥1,650〜）：秋田酒こまち・精米歩合60%\n・純米吟醸（¥2,200〜）：山田錦・精米歩合50%\n・純米大吟醸（¥2,970〜）：美山錦・精米歩合45%\n・純米酒（¥1,430〜）：日常酒として最適\n・純米にごり酒（¥1,980〜）：クリーミーな限定品\n\n【岩木正宗シリーズ】\n・立佞武多：青森の夏祭りをイメージ\n・津軽金木：太宰治の故郷にちなんだお酒\n・奥津軽：3年熟成の最高級品\n\n【つがるJOMONシリーズ】\n・縄文遺跡群世界遺産登録記念のお酒\n\n燗酒専心の竹浪酒造店では、どのお酒も温めて美味しく楽しめます🌸`;
        }
        
        // 青森・津軽について
        if (lowerMessage.includes('青森') || lowerMessage.includes('津軽') || lowerMessage.includes('地酒')) {
            return `青森・津軽の地酒の魅力をご紹介します🗻\n\n【津軽平野】\n肥沃な平野で育つ良質な米\n\n【岩木山】\n津軽富士から湧き出る清らかな伏流水\n\n【厳しい寒さ】\n低温でゆっくりとした発酵が生む繊細な味わい\n\n竹浪酒造店は、この津軽の恵みを活かした手仕事醸造で、地域の特色あふれる日本酒を造っています🌸`;
        }
        
        // 見学について
        if (lowerMessage.includes('見学') || lowerMessage.includes('訪問') || lowerMessage.includes('体験')) {
            return `蔵見学についてお答えします🍶\n\n竹浪酒造店では見学を受け付けている可能性がありますが、詳細は直接お問い合わせください。\n\n【お問い合わせ】\n電話：0172-88-8030\n住所：青森県北津軽郡板柳町板柳土井113-1\n\n2025年6月6日には「大復活祭」も予定されています🌸`;
        }
        
        // 特定商品の詳細質問
        if (lowerMessage.includes('七郎兵衛') && lowerMessage.includes('特別純米')) {
            const product = knowledge.products.shichirobe_tokubetsu_junmai;
            return `七郎兵衛 特別純米酒についてご紹介します🍶\n\n【基本情報】\n・原料米：${product.rice}\n・精米歩合：${product.polishing}\n・価格：${product.price}\n\n【味わいの特徴】\n・香り：やわらかな果実香、青りんごのような爽やかさ\n・味わい：しっかりとした米の旨味、バランス良好\n・燗酒：40℃で米の旨味が開花します\n\n【おすすめの楽しみ方】\n・津軽の郷土料理（じゃっぱ汁、けの汁）と\n・焼き魚や煮物との相性も抜群です\n\n受賞歴もあり、竹浪酒造店の代表的なお酒です🌸`;
        }
        
        if (lowerMessage.includes('立佞武多') || lowerMessage.includes('たちねぷた')) {
            return `岩木正宗 立佞武多についてご紹介します🎆\n\n【特徴】\n・青森の夏祭り「立佞武多」をイメージした特別純米酒\n・素戔嗚尊ラベルとかぐやラベルの2種類\n・価格：720ml ¥1,870\n\n【味わい】\n・力強く男性的な香り\n・津軽の夏を表現した活気ある味わい\n・祭り囃子のような余韻\n\n【楽しみ方】\n・夏でも燗酒で楽しめます\n・津軽の郷土料理や祭りの屋台料理と\n・祭り気分で賑やかにお楽しみください🌸`;
        }
        
        if (lowerMessage.includes('つがるjomon') || lowerMessage.includes('縄文') || lowerMessage.includes('遮光器土偶')) {
            return `つがるJOMONシリーズについてご紹介します🏺\n\n【特別純米酒】\n・遮光器土偶デザインのラベルが印象的\n・つがるの縄文遺跡群世界遺産登録記念\n・価格：720ml ¥1,650 / 1800ml ¥3,300\n\n【純米大吟醸】\n・美山錦45%精米の最高級品\n・なめらかでフルーティー、ジューシーな甘味\n・価格：720ml ¥2,970 / 1800ml ¥5,940\n\n【楽しみ方】\n・古代を思わせる神秘的な香り\n・山菜料理や古代米料理との相性◎\n・縄文ロマンと共にお楽しみください🌸`;
        }
        
        // 一般的な日本酒の質問
        return `日本酒についてお答えします🍶\n\n竹浪酒造店は「燗酒専心」をモットーに、燗酒を本義として醸造している青森の酒蔵です。岩木山の伏流水と津軽平野の米を使用した手仕事醸造で、酒本来の味を追求しています。\n\n他にも燗酒や竹浪酒造店について、お気軽にお聞きください🌸`;
    }
    
    /**
     * GPT-4 API呼び出し
     */
    async getGPTResponse(message) {
        try {
            const systemPrompt = this.config.chatbot.systemPrompt;
            const companyContext = this.buildCompanyContext();
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.openai.apiKey}`
                },
                body: JSON.stringify({
                    model: this.config.openai.model,
                    messages: [
                        {
                            role: 'system',
                            content: `${systemPrompt}\n\n【竹浪酒造店の詳細情報】\n${companyContext}`
                        },
                        ...this.conversationHistory.slice(-6), // 直近の会話履歴
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: this.config.openai.maxTokens,
                    temperature: this.config.openai.temperature
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('GPT API error response:', errorText);
                throw new Error(`GPT API error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0]?.message?.content;
            
            if (!aiResponse) {
                console.error('No response content from GPT API');
                return null;
            }
            
            console.log('GPT API response received successfully');
            return aiResponse;
            
        } catch (error) {
            console.error('GPT API error:', error);
            
            // API特有のエラーハンドリング
            if (error.message.includes('401')) {
                console.error('OpenAI API key is invalid or expired');
                return 'APIキーの設定に問題があります。管理者にお問い合わせください。🌸';
            }
            if (error.message.includes('429')) {
                console.error('OpenAI API rate limit exceeded');
                return 'しばらく時間をおいてから再度お試しください。🌸';
            }
            if (error.message.includes('500')) {
                console.error('OpenAI API server error');
                return 'AIサービスに一時的な問題が発生しています。しばらくお待ちください。🌸';
            }
            
            return null;
        }
    }
    
    /**
     * 企業コンテキスト構築
     */
    buildCompanyContext() {
        const kb = this.companyManager?.knowledgeBase;
        if (!kb) return '';
        
        return `
企業名: ${kb.basic.name}
所在地: ${kb.basic.location}
電話: ${kb.basic.phone}
モットー: ${kb.basic.motto}
特徴: ${kb.features.philosophy}
使用水: ${kb.features.water}
使用米: ${kb.features.rice}
製造工程: ${kb.features.process}

商品情報:
- 純米大吟醸: ${kb.products.junmai_daiginjo.description}
- 生原酒: ${kb.products.nama_genshu.description}
- 普通酒: ${kb.products.futsu_shu.description}

燗酒専門知識:
- 定義: ${kb.kan_sake.definition}
- 温度: ぬる燗(40℃)、上燗(45℃)、熱燗(50℃)
- 特徴: ${kb.kan_sake.benefits.join('、')}
        `.trim();
    }
    
    /**
     * 翻訳処理
     */
    async translateResponse(text, targetLang) {
        if (!this.config?.deepl?.apiKey || targetLang === 'ja') {
            return text;
        }
        
        try {
            const deeplLangCode = this.mapLanguageCode(targetLang);
            
            const response = await fetch(this.config.deepl.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `DeepL-Auth-Key ${this.config.deepl.apiKey}`
                },
                body: new URLSearchParams({
                    text: text,
                    source_lang: 'JA',
                    target_lang: deeplLangCode
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('DeepL API error:', response.status, errorText);
                throw new Error(`DeepL API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.translations && data.translations.length > 0) {
                console.log(`Translation completed: JA -> ${deeplLangCode}`);
                return data.translations[0].text;
            } else {
                console.error('No translation data received from DeepL');
                return text;
            }
            
        } catch (error) {
            console.error('Translation error:', error);
            
            // DeepL API特有のエラーハンドリング
            if (error.message.includes('403')) {
                console.error('DeepL API key is invalid');
            }
            if (error.message.includes('456')) {
                console.error('DeepL quota exceeded');
            }
            
            return text; // 翻訳失敗時は元のテキストを返す
        }
    }
    
    /**
     * 言語コードマッピング
     */
    mapLanguageCode(code) {
        const mapping = {
            'en': 'EN',
            'zh-cn': 'ZH',
            'zh-tw': 'ZH',
            'ko': 'KO',
            'fr': 'FR',
            'es': 'ES',
            'de': 'DE',
            'it': 'IT',
            'pt': 'PT'
        };
        
        return mapping[code] || 'EN';
    }
    
    /**
     * タイピングインジケーター表示
     */
    showTypingIndicator() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🌸</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        
        this.chatMessages?.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    /**
     * タイピングインジケーター非表示
     */
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = this.chatMessages?.querySelector('.typing-indicator');
        typingIndicator?.remove();
    }
    
    /**
     * メッセージ追加
     */
    addMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        
        if (type === 'ai') {
            messageDiv.innerHTML = `
                <div class="message-avatar">🌸</div>
                <div class="message-content">${this.formatMessage(message)}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${this.formatMessage(message)}</div>
            `;
        }
        
        this.chatMessages?.appendChild(messageDiv);
        this.scrollToBottom();
        
        // 会話履歴に追加
        this.conversationHistory.push({
            role: type === 'user' ? 'user' : 'assistant',
            content: message
        });
        
        // 履歴の長さを制限
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-10);
        }
    }
    
    /**
     * メッセージフォーマット
     */
    formatMessage(message) {
        return message
            .replace(/\n/g, '<br>')
            .replace(/【([^】]+)】/g, '<strong>【$1】</strong>')
            .replace(/・([^\n]+)/g, '・<span class="highlight">$1</span>');
    }
    
    /**
     * スクロール最下部
     */
    scrollToBottom() {
        setTimeout(() => {
            if (this.chatMessages) {
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }
        }, 100);
    }
    
    /**
     * 言語変更
     */
    setLanguage(language) {
        this.currentLanguage = language;
        console.log(`Language changed to: ${language}`);
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.aiConfig !== 'undefined' && typeof window.companyManager !== 'undefined') {
        window.aiChatbot = new AIChatbot();
        console.log('Takenami Shuzoten AI Chatbot initialized successfully');
    } else {
        console.error('AI Config or Company Manager not found');
    }
});