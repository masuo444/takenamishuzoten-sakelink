// Modern AI Chatbot for Takenami Shuzoten
// 竹浪酒造店専用モダンAIチャットボット

class ModernChatbot {
    constructor() {
        this.config = window.aiConfig;
        this.companyManager = window.companyManager;
        this.isOpen = false;
        this.isMinimized = false;
        this.isTyping = false;
        this.conversationHistory = [];
        this.currentLanguage = 'ja';
        
        this.initializeElements();
        this.bindEvents();
        this.setupQuickActions();
        
        // デバッグ用
        console.log('Modern Chatbot initialized');
    }
    
    initializeElements() {
        this.chatButton = document.getElementById('chatButton');
        this.chatInterface = document.getElementById('chatInterface');
        this.closeBtn = document.getElementById('closeChat');
        this.minimizeBtn = document.getElementById('minimizeChat');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.quickBtns = document.querySelectorAll('.quick-btn');
    }
    
    bindEvents() {
        // チャットボタン
        this.chatButton?.addEventListener('click', () => this.toggleChat());
        
        // 閉じるボタン
        this.closeBtn?.addEventListener('click', () => this.closeChat());
        
        // 最小化ボタン
        this.minimizeBtn?.addEventListener('click', () => this.minimizeChat());
        
        // 送信ボタン
        this.sendButton?.addEventListener('click', () => this.sendMessage());
        
        // Enterキー
        this.messageInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // クイックアクション
        this.quickBtns?.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.sendQuickMessage(message);
            });
        });
    }
    
    setupQuickActions() {
        // クイックアクションボタンのアニメーション
        this.quickBtns?.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px) scale(1.05)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.isOpen = true;
        this.isMinimized = false;
        this.chatInterface?.classList.add('open');
        this.chatInterface?.classList.remove('minimized');
        this.chatButton?.classList.add('active');
        
        // フォーカス
        setTimeout(() => {
            this.messageInput?.focus();
        }, 300);
        
        // 通知ドットを非表示
        const notificationDot = this.chatButton?.querySelector('.notification-dot');
        if (notificationDot) {
            notificationDot.style.display = 'none';
        }
    }
    
    closeChat() {
        this.isOpen = false;
        this.isMinimized = false;
        this.chatInterface?.classList.remove('open', 'minimized');
        this.chatButton?.classList.remove('active');
    }
    
    minimizeChat() {
        this.isMinimized = true;
        this.chatInterface?.classList.add('minimized');
        this.chatInterface?.classList.remove('open');
    }
    
    async sendMessage() {
        const message = this.messageInput?.value?.trim();
        if (!message || this.isTyping) return;
        
        // ユーザーメッセージを表示
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        // AI応答を取得
        await this.getAIResponse(message);
    }
    
    sendQuickMessage(message) {
        this.messageInput.value = message;
        this.sendMessage();
    }
    
    async getAIResponse(userMessage) {
        this.showTypingIndicator();
        
        try {
            let response;
            
            // GPT-4 APIを使用（APIキーがある場合）
            if (this.config?.openai?.apiKey && this.config.openai.apiKey.length > 10) {
                response = await this.getGPTResponse(userMessage);
                console.log('Using GPT-4 API for response');
            }
            
            // GPTが利用できない場合は内蔵応答
            if (!response) {
                response = this.generateLocalResponse(userMessage);
            }
            
            // DeepL翻訳（日本語以外の場合）
            if (this.currentLanguage !== 'ja' && this.config?.deepl?.apiKey && this.config.deepl.apiKey.length > 10) {
                response = await this.translateResponse(response, this.currentLanguage);
                console.log(`Translating to: ${this.currentLanguage}`);
            }
            
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
            
        } catch (error) {
            console.error('AI response error:', error);
            this.hideTypingIndicator();
            this.addMessage('申し訳ございません。一時的な問題が発生しました。🌸', 'ai');
        }
    }
    
    async getGPTResponse(message) {
        try {
            const systemPrompt = `あなたは「AIさくら」です。竹浪酒造店専用のアシスタントとして振る舞ってください。

【竹浪酒造店について】
- 所在地: 青森県北津軽郡板柳町板柳土井113-1
- 電話: 0172-88-8030
- モットー: 「燗酒専心」
- 特徴: 岩木山の伏流水と津軽平野の米を使用した手仕事醸造

【専門知識】
1. 燗酒の専門知識と楽しみ方
2. 日本酒の基礎知識
3. 青森・津軽地域の特色
4. 竹浪酒造店の商品と製造法

親しみやすく、燗酒の魅力を伝え、🌸🍶などの絵文字を適度に使用してください。`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.openai.apiKey}`
                },
                body: JSON.stringify({
                    model: this.config.openai.model || 'gpt-4',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...this.conversationHistory.slice(-6),
                        { role: 'user', content: message }
                    ],
                    max_tokens: this.config.openai.maxTokens || 1000,
                    temperature: this.config.openai.temperature || 0.7
                })
            });
            
            if (!response.ok) {
                throw new Error(`GPT API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0]?.message?.content;
            
        } catch (error) {
            console.error('GPT API error:', error);
            return null;
        }
    }
    
    generateLocalResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('竹浪') || lowerMessage.includes('酒蔵') || lowerMessage.includes('について')) {
            return `竹浪酒造店についてご紹介します🍶

🏪 **竹浪酒造店**
📍 青森県板柳町
☎️ 0172-88-8030
🌟 モットー：燗酒専心

🌸 **特徴**
・岩木山の清らかな伏流水
・津軽平野の良質な米
・手仕事による一貫醸造
・燗酒を本義とした味作り

燗酒専心の心で、酒本来の味を追求しています✨`;
        }
        
        if (lowerMessage.includes('燗酒') || lowerMessage.includes('燗') || lowerMessage.includes('温め')) {
            return `燗酒の魅力をご紹介します🍶

🔥 **燗酒の楽しみ方**
・ぬる燗（40℃）：まろやかな口当たり
・上燗（45℃）：香りが立ち、味わい深く
・熱燗（50℃）：体が温まり、料理との相性◎

🌸 **燗酒専心の竹浪酒造店**
燗酒にして本領を発揮するお酒作りにこだわっています。
岩木山の伏流水と津軽平野の米が織りなす、燗酒ならではの味わいをお楽しみください✨`;
        }
        
        if (lowerMessage.includes('商品') || lowerMessage.includes('お酒') || lowerMessage.includes('おすすめ')) {
            return `竹浪酒造店のおすすめ商品🍶

🌟 **七郎兵衛 特別純米酒**
秋田酒こまち・精米歩合60%の代表銘柄

🎆 **岩木正宗 立佞武多**
青森の夏祭りをイメージした特別純米酒

🏺 **つがるJOMON 純米大吟醸**
縄文遺跡群世界遺産登録記念の最高級品

❄️ **津軽雪国 純米吟醸**
津軽の雪深い冬をイメージした清涼感

🏪 **板柳の誉 本醸造**
地元板柳町の名を冠した親しみやすい日常酒

どのお酒も燗酒でお楽しみいただけます🌸`;
        }
        
        return `ご質問ありがとうございます🌸

竹浪酒造店は「燗酒専心」をモットーに、岩木山の伏流水と津軽平野の米を使った手仕事醸造で酒本来の味を追求している青森の酒蔵です。

🍶 燗酒や日本酒について
🏪 竹浪酒造店について
🗻 青森・津軽の地酒について

何でもお気軽にお聞きください！`;
    }
    
    async translateResponse(text, targetLang) {
        if (!this.config?.deepl?.apiKey || targetLang === 'ja') {
            return text;
        }
        
        try {
            const response = await fetch(this.config.deepl.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `DeepL-Auth-Key ${this.config.deepl.apiKey}`
                },
                body: new URLSearchParams({
                    text: text,
                    source_lang: 'JA',
                    target_lang: targetLang === 'en' ? 'EN' : 'EN'
                })
            });
            
            if (!response.ok) {
                throw new Error(`DeepL API error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.translations?.[0]?.text || text;
            
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message-container typing-indicator';
        typingDiv.innerHTML = `
            <div class="avatar-mini">
                <img src="ai-sakura-icon.png" alt="AIさくら">
            </div>
            <div class="message-bubble ai-bubble typing">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages?.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = this.chatMessages?.querySelector('.typing-indicator');
        typingIndicator?.remove();
    }
    
    addMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-container ${type}-message`;
        
        const currentTime = new Date().toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        if (type === 'ai') {
            messageDiv.innerHTML = `
                <div class="avatar-mini">
                    <img src="ai-sakura-icon.png" alt="AIさくら">
                </div>
                <div class="message-bubble ai-bubble">
                    ${this.formatMessage(message)}
                    <div class="message-time">${currentTime}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-bubble user-bubble">
                    ${this.formatMessage(message)}
                    <div class="message-time">${currentTime}</div>
                </div>
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
    
    formatMessage(message) {
        return message
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/・([^\n]+)/g, '・<span class="highlight">$1</span>');
    }
    
    scrollToBottom() {
        setTimeout(() => {
            if (this.chatMessages) {
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }
        }, 100);
    }
    
    setLanguage(language) {
        this.currentLanguage = language;
        const languageIndicator = document.querySelector('.language-indicator');
        if (languageIndicator) {
            const langMap = {
                'ja': '🌐 日本語',
                'en': '🌐 English',
                'zh': '🌐 中文'
            };
            languageIndicator.textContent = langMap[language] || '🌐 日本語';
        }
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.aiConfig !== 'undefined') {
        window.modernChatbot = new ModernChatbot();
        console.log('Modern Chatbot system initialized successfully');
    } else {
        console.error('AI Config not found');
    }
});