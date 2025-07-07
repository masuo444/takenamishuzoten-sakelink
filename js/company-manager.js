// Company Manager for Takenami Shuzoten SAKElink
// 竹浪酒造店専用企業管理システム - 情報分離・セキュリティ管理

class CompanyManager {
    constructor() {
        this.companyId = 'takenami_shuzoten';
        this.companyName = '竹浪酒造店';
        this.businessType = 'sake';
        this.initialized = false;
        
        // 許可されたトピック・キーワード
        this.allowedTopics = [
            '竹浪酒造店', '竹波酒造店', 'たけなみ',
            '燗酒', '燗', 'かんざけ',
            '青森', '津軽', '板柳町', '岩木山',
            '日本酒', '純米大吟醸', '生原酒', '普通酒',
            '手仕事', '伏流水', '津軽平野',
            '酒蔵', '醸造', '麹', '醪', '上槽'
        ];
        
        // ブロックされた他社キーワード
        this.blockedCompanies = [
            // 他の有名酒蔵
            '獺祭', '久保田', '八海山', '十四代', '而今', '新政', '作', '花陽浴',
            '磯自慢', '醸し人九平次', '雨後の月', '出羽桜', '浦霞', '一ノ蔵',
            // 他の青森の酒蔵
            '田酒', '陸奥八仙', '豊盃', '善知鳥', '鳩正宗', '白神山地',
            // その他の企業
            '他社', '競合', '別の酒蔵', '他の蒸留所', '他のワイナリー'
        ];
        
        // 竹浪酒造店の知識ベース
        this.knowledgeBase = {
            basic: {
                name: '竹浪酒造店',
                reading: 'たけなみしゅぞうてん',
                location: '青森県北津軽郡板柳町板柳土井113-1',
                phone: '0172-88-8030',
                motto: '燗酒専心',
                established: '詳細不明（伝統的な酒蔵）',
                website: 'https://takenamishuzoten.com'
            },
            features: {
                water: '岩木山の伏流水を使用。清らかで軟水の特徴を持つ',
                rice: '津軽平野で育まれた良質な米を主原料として使用',
                process: '米洗いから麹造り、醪、上槽まで一貫した手仕事で醸造',
                philosophy: '燗酒を本義として醸している。燗酒専心をモットーとする',
                quality: '酒本来の味を追求し、普通酒から純米大吟醸まで幅広く製造'
            },
            products: {
                // 七郎兵衛シリーズ
                shichirobe_tokubetsu_junmai: {
                    name: '七郎兵衛 特別純米酒',
                    type: '特別純米酒',
                    rice: '秋田酒こまち（青森県産）',
                    polishing: '60%',
                    alcohol: '15度',
                    sake_meter: '+3（やや辛口）',
                    acidity: '1.4',
                    yeast: '青森県酵母',
                    year: '2023年度',
                    production: '限定300石',
                    price: '720ml ¥1,650 / 1800ml ¥3,300',
                    description: 'やわらかな果実香の後に、しっかりとした米の旨味が感じられます',
                    detailed_taste: {
                        aroma: 'やわらかな果実香、穏やかで上品。青りんごや洋梨のような爽やかさ',
                        flavor: 'しっかりとした米の旨味、バランス良好。秋田酒こまちの特徴である芯のある味わい',
                        mouthfeel: 'なめらかで優しい、津軽の軟水らしいやわらかさ',
                        finish: 'すっきりとしたキレ、余韻に米の甘みが残る',
                        kan_sake: '40℃で米の旨味が開花、45℃で最も美味しく感じられる'
                    },
                    pairing: {
                        temperatures: 'ぬる燗（40℃）～上燗（45℃）',
                        local_food: 'じゃっぱ汁、けの汁、いがめんち、ホタテ焼き',
                        japanese_food: '焼き魚（サバ、サンマ）、煮物（筑前煮、肉じゃが）、鍋料理（寄せ鍋、おでん）',
                        snacks: '板わさ、塩辛、漬物、焼き鳥',
                        season: '秋～春におすすめ、特に寒い日の燗酒として',
                        glass: '伝統的なおちょこ、津軽塗のぐい呑み'
                    },
                    awards: ['青森県清酒鑑評会入賞', '全国燗酒コンテスト優等賞受賞'],
                    brewing_notes: '岩木山の伏流水を使用し、昔ながらの手仕事で丁寧に醸造。燗酒で真価を発揮する設計で造られています',
                    features: ['燗酒で真価を発揮', 'バランスの良い味わい', '果実香', '手仕事醸造', '津軽の軟水使用']
                },
                shichirobe_junmai_ginjo: {
                    name: '七郎兵衛 純米吟醸',
                    type: '純米吟醸酒',
                    rice: '山田錦（酒米の王様）',
                    polishing: '50%',
                    alcohol: '15.5度',
                    sake_meter: '+2（やや辛口）',
                    acidity: '1.3',
                    price: '720ml ¥2,200 / 1800ml ¥4,400',
                    description: 'なめらかでジューシー、果実の香りも感じられる上品な純米吟醸酒',
                    detailed_taste: {
                        aroma: '華やかな果実香、エレガント。山田錦特有の上品な香り',
                        flavor: 'なめらかでジューシー、山田錦の上品な甘み',
                        finish: '長く続く余韻',
                        kan_sake: '冷酒から燗酒まで幅広く楽しめる'
                    },
                    pairing: {
                        temperatures: '冷酒（8℃）～ぬる燗（40℃）',
                        food: '白身魚の刺身、天ぷら、茶碗蒸し',
                        season: '通年楽しめる',
                        glass: 'ワイングラス、おちょこ'
                    },
                    features: ['上品な香り', '滑らかな口当たり', '山田錦使用', '冷燗両用']
                },
                shichirobe_junmai_daiginjo: {
                    name: '七郎兵衛 純米大吟醸',
                    type: '純米大吟醸酒',
                    rice: '美山錦',
                    polishing: '45%',
                    price: '720ml ¥2,970 / 1800ml ¥5,940',
                    description: '竹浪酒造店の最高峰、洗練された味わいの逸品',
                    features: ['華やかな香り', '繊細な味わい', '最高級品']
                },
                shichirobe_junmai: {
                    name: '七郎兵衛 純米酒',
                    type: '純米酒',
                    rice: '秋田酒こまち',
                    polishing: '75%',
                    price: '720ml ¥1,430 / 1800ml ¥2,860',
                    description: '米の旨味を存分に感じられる、日常酒としても最適な一本',
                    features: ['米の旨味が豊か', '燗酒に最適', '日常酒']
                },
                shichirobe_nigori: {
                    name: '七郎兵衛 純米にごり酒',
                    type: '純米にごり酒',
                    price: '720ml ¥1,980 / 1800ml ¥3,960',
                    description: 'クリーミーでまろやかな口当たり。米の旨味と自然な甘みが楽しめる',
                    features: ['クリーミーな口当たり', '季節限定', '数量限定']
                },
                // 岩木正宗シリーズ
                iwaki_tachineputa: {
                    name: '岩木正宗 立佞武多',
                    type: '特別純米酒',
                    price: '720ml ¥1,870',
                    description: '青森の夏祭り「立佞武多」をイメージした特別純米酒',
                    features: ['立佞武多デザイン', '素戔嗚尊・かぐや姫ラベル', '津軽の夏']
                },
                iwaki_kanagi: {
                    name: '岩木正宗 津軽金木',
                    type: '特別純米酒',
                    price: '720ml ¥1,870',
                    description: '太宰治生誕の地「金木町」にちなんだ特別純米酒',
                    features: ['太宰治の故郷', '文学的な深み', '読書のお供']
                },
                iwaki_okutsugaru: {
                    name: '岩木正宗 奥津軽',
                    type: '純米大吟醸',
                    price: '720ml ¥3,190',
                    description: '3年間の熟成を経た、やわらかな熟成酒',
                    features: ['3年間低温熟成', 'まろやかで深い味わい', '特別な日に']
                },
                // つがるJOMONシリーズ
                jomon_tokubetsu_junmai: {
                    name: 'つがるJOMON 特別純米酒',
                    type: '特別純米酒',
                    price: '720ml ¥1,650 / 1800ml ¥3,300',
                    description: '遮光器土偶デザインが印象的。世界遺産登録記念の特別な一本',
                    features: ['遮光器土偶ラベル', '世界遺産登録記念', '古代への想い']
                },
                jomon_daiginjo: {
                    name: 'つがるJOMON 純米大吟醸',
                    type: '純米大吟醸酒',
                    rice: '美山錦',
                    polishing: '45%',
                    price: '720ml ¥2,970 / 1800ml ¥5,940',
                    description: 'なめらかでフルーティー、ジューシーな甘味が特徴',
                    features: ['フルーティー', '上品な甘み', '縄文ロマン']
                }
            },
            kan_sake: {
                definition: '日本酒を温めて飲む方法。竹浪酒造店の専門分野',
                temperatures: {
                    nurukan: '40℃前後のぬる燗。香りが立ち、まろやかな味わい',
                    atsukan: '50℃前後の熱燗。アルコールが飛び、すっきりとした味わい',
                    joukan: '45℃前後の上燗。バランスの良い温度帯'
                },
                benefits: [
                    '香りが立つ', 'まろやかになる', '体が温まる', 
                    '料理との相性が良い', '日本酒本来の味わい'
                ],
                suitable_products: ['普通酒', '純米酒', '本醸造酒'],
                pairing: ['鍋料理', '煮物', '焼き魚', '漬物', '津軽の郷土料理']
            },
            region: {
                aomori: '本州最北端の県。厳しい寒さと豊かな自然に恵まれた地域',
                tsugaru: '津軽平野は青森県西部の肥沃な平野。良質な米の産地',
                itayanagi: '板柳町は津軽平野中央部に位置する農業の町',
                iwakisan: '岩木山（津軽富士）から湧き出る良質な伏流水の源'
            }
        };
        
        this.init();
    }
    
    /**
     * 初期化処理
     */
    init() {
        console.log(`Initializing Company Manager for ${this.companyName}`);
        this.initialized = true;
        
        // グローバル企業データを設定
        window.currentCompany = {
            id: this.companyId,
            name: this.companyName,
            type: this.businessType,
            data: this.knowledgeBase
        };
    }
    
    /**
     * 質問が許可されたトピックかチェック
     */
    isAllowedQuestion(question) {
        if (!question || typeof question !== 'string') {
            return false;
        }
        
        const normalizedQuestion = question.toLowerCase().trim();
        
        // 空の質問は許可しない
        if (normalizedQuestion.length === 0) {
            return false;
        }
        
        // 他社名が含まれているかチェック
        const hasBlockedCompany = this.blockedCompanies.some(company => 
            normalizedQuestion.includes(company.toLowerCase())
        );
        
        if (hasBlockedCompany) {
            console.log('Blocked question due to competitor mention:', question);
            return false;
        }
        
        // 許可されたトピックが含まれているかチェック
        const hasAllowedTopic = this.allowedTopics.some(topic => 
            normalizedQuestion.includes(topic.toLowerCase())
        );
        
        // 日本酒一般の質問も許可（ただし竹浪酒造店コンテキスト内で）
        const hasSakeGeneralTopic = [
            '日本酒', '燗酒', '純米', '大吟醸', '醸造', '酒蔵', '麹', '醪'
        ].some(topic => normalizedQuestion.includes(topic));
        
        return hasAllowedTopic || hasSakeGeneralTopic;
    }
    
    /**
     * 回答をフィルタリング
     */
    filterResponse(response) {
        if (!response || typeof response !== 'string') {
            return this.getDefaultResponse();
        }
        
        // 他社名が含まれていないかチェック
        let filteredResponse = response;
        
        this.blockedCompanies.forEach(company => {
            const regex = new RegExp(company, 'gi');
            if (regex.test(filteredResponse)) {
                console.log('Blocked response due to competitor mention:', company);
                return this.getOutOfScopeResponse();
            }
        });
        
        // 竹浪酒造店の情報を強化
        filteredResponse = this.enhanceWithCompanyInfo(filteredResponse);
        
        return filteredResponse;
    }
    
    /**
     * 竹浪酒造店の情報を回答に追加
     */
    enhanceWithCompanyInfo(response) {
        // 燗酒に関する質問の場合、竹浪酒造店の燗酒専心を強調
        if (response.toLowerCase().includes('燗酒')) {
            response += '\n\n竹浪酒造店は「燗酒専心」をモットーとしており、燗酒を本義として醸造しています🍶';
        }
        
        // 日本酒一般の質問の場合、竹浪酒造店の特徴を追加
        if (response.toLowerCase().includes('日本酒') && !response.includes('竹浪酒造店')) {
            response += '\n\n竹浪酒造店では、岩木山の伏流水と津軽平野の米を使用した手仕事醸造で、酒本来の味を追求しています🌸';
        }
        
        return response;
    }
    
    /**
     * 企業固有の知識を取得
     */
    getCompanyKnowledge(topic) {
        const kb = this.knowledgeBase;
        
        switch (topic.toLowerCase()) {
            case '基本情報':
            case 'basic':
                return kb.basic;
                
            case '特徴':
            case 'features':
                return kb.features;
                
            case '商品':
            case 'products':
                return kb.products;
                
            case '燗酒':
            case 'kan_sake':
                return kb.kan_sake;
                
            case '地域':
            case 'region':
                return kb.region;
                
            default:
                return null;
        }
    }
    
    /**
     * 推奨質問を生成
     */
    getSuggestedQuestions() {
        return [
            '竹浪酒造店について教えてください',
            '燗酒の楽しみ方を教えてください',
            'おすすめのお酒はありますか？',
            '青森の地酒の特徴は何ですか？',
            '津軽平野の米について教えてください',
            '岩木山の水の特徴は？',
            '手仕事醸造とはどのようなものですか？',
            '燗酒に合う料理はありますか？'
        ];
    }
    
    /**
     * 範囲外質問への回答
     */
    getOutOfScopeResponse() {
        const responses = [
            '申し訳ございませんが、竹浪酒造店に関する質問にのみお答えできます🌸\n燗酒や日本酒について、何かお聞きしたいことはありませんか？',
            '竹浪酒造店専用のアシスタントですので、当蔵に関することでしたらお気軽にお聞きください🍶',
            '恐れ入りますが、竹浪酒造店と燗酒に関する質問にのみお答えしております🌸\n他にご質問はございませんか？'
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    /**
     * デフォルト回答
     */
    getDefaultResponse() {
        return '竹浪酒造店について、何かご質問はございませんか？燗酒のことでしたら何でもお聞きください🌸';
    }
    
    /**
     * 緊急時の連絡先情報
     */
    getContactInfo() {
        return {
            name: this.knowledgeBase.basic.name,
            phone: this.knowledgeBase.basic.phone,
            address: this.knowledgeBase.basic.location,
            website: this.knowledgeBase.basic.website
        };
    }
    
    /**
     * デバッグ情報
     */
    getDebugInfo() {
        return {
            companyId: this.companyId,
            companyName: this.companyName,
            businessType: this.businessType,
            initialized: this.initialized,
            allowedTopicsCount: this.allowedTopics.length,
            blockedCompaniesCount: this.blockedCompanies.length
        };
    }
}

// グローバルアクセス用
window.CompanyManager = CompanyManager;

// 竹浪酒造店用インスタンスを作成
window.companyManager = new CompanyManager();

// 質問フィルタリング関数（グローバル）
window.filterQuestion = function(question) {
    return window.companyManager.isAllowedQuestion(question);
};

// 回答フィルタリング関数（グローバル）
window.filterResponse = function(response) {
    return window.companyManager.filterResponse(response);
};

console.log('Takenami Shuzoten Company Manager initialized successfully');