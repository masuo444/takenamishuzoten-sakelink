// Main JavaScript for Takenami Shuzoten SAKElink
// 竹浪酒造店専用メインスクリプト

class TakenamiSAKElink {
    constructor() {
        this.companyData = null;
        this.initialized = false;
        
        this.init();
    }
    
    /**
     * 初期化処理
     */
    async init() {
        console.log('Initializing Takenami Shuzoten SAKElink...');
        
        try {
            // 企業データを設定
            this.setupCompanyData();
            
            // UIを更新
            this.updateUI();
            
            // 自動化システムを実行
            await this.runAutomationSystems();
            
            // イベントリスナーを設定
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('Takenami Shuzoten SAKElink initialized successfully');
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showErrorMessage('システムの初期化に失敗しました。');
        }
    }
    
    /**
     * 企業データ設定
     */
    setupCompanyData() {
        this.companyData = {
            company: {
                name: '竹浪酒造店',
                description: '「燗酒専心」をモットーに、岩木山の伏流水と津軽平野の米を使用し、米洗いから麹造り、醪、上槽まで一貫した手仕事で酒本来の味を追求する青森の酒蔵です。',
                location: '青森県北津軽郡板柳町',
                address: '〒038-3662 青森県北津軽郡板柳町板柳土井113-1',
                phone: '0172-88-8030',
                motto: '燗酒専心',
                features: ['岩木山伏流水', '津軽平野の米', '手仕事醸造', '燗酒専心'],
                website: 'https://takenamishuzoten.com',
                images: {
                    logo: 'https://takenamishuzoten.com/cdn/shop/files/logo-black.png',
                    background: 'https://takenamishuzoten.com/cdn/shop/files/concept-bg.png'
                }
            },
            products: [
                {
                    name: '純米大吟醸',
                    type: '純米大吟醸酒',
                    description: '津軽平野の最高級の米を使用し、丁寧に醸造した純米大吟醸酒。燗酒でも冷酒でもお楽しみいただけます。',
                    features: ['津軽平野の米', '燗酒対応', '冷酒対応', '最高級'],
                    image: 'assets/images/takenami-sake-1.jpg'
                },
                {
                    name: '生原酒',
                    type: '生原酒',
                    description: '火入れをしない生の原酒。フレッシュで力強い味わいが特徴です。',
                    features: ['火入れなし', 'フレッシュ', '力強い味わい', '季節限定'],
                    image: 'assets/images/takenami-sake-2.jpg'
                },
                {
                    name: '普通酒',
                    type: '普通酒',
                    description: '日常酒として親しまれている普通酒。燗酒にして本領を発揮する味わいです。',
                    features: ['日常酒', '燗酒推奨', '本領発揮', 'コストパフォーマンス'],
                    image: 'assets/images/takenami-sake-3.jpg'
                }
            ],
            businessType: 'sake',
            specialties: ['燗酒', '手仕事醸造', '津軽の地酒'],
            websiteUrl: 'https://takenamishuzoten.com'
        };
        
        // グローバルに設定
        window.companyData = this.companyData;
    }
    
    /**
     * UI更新
     */
    updateUI() {
        const company = this.companyData.company;
        
        // 基本情報の更新
        this.updateElement('companyName', company.name);
        this.updateElement('companyDescription', company.description);
        this.updateElement('location', company.address);
        this.updateElement('phone', company.phone);
        this.updateElement('motto', company.motto);
        this.updateElement('features', company.features.join('、'));
        
        // 連絡先情報
        this.updateElement('contactPhone', company.phone);
        this.updateElement('contactAddress', company.address);
        
        // メタ情報の更新
        this.updatePageTitle();
        this.updateMetaDescription();
        
        // 商品情報の更新
        this.updateProducts();
        
        // 画像の更新
        this.updateImages();
    }
    
    /**
     * 要素更新
     */
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element && content) {
            element.textContent = content;
        }
    }
    
    /**
     * ページタイトル更新
     */
    updatePageTitle() {
        const title = `${this.companyData.company.name} | ${this.companyData.company.motto} - 青森の地酒`;
        document.title = title;
        
        // OGタイトルも更新
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', title);
        }
        
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', title);
        }
    }
    
    /**
     * メタディスクリプション更新
     */
    updateMetaDescription() {
        const description = this.companyData.company.description;
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        }
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.setAttribute('content', description);
        }
        
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) {
            twitterDesc.setAttribute('content', description);
        }
    }
    
    /**
     * 商品情報更新
     */
    updateProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
        // 既存の商品カードは保持（HTMLに記載済み）
        console.log('Products loaded:', this.companyData.products.length);
    }
    
    /**
     * 画像更新
     */
    updateImages() {
        const company = this.companyData.company;
        
        // ヒーロー画像
        const heroImage = document.getElementById('heroImage');
        if (heroImage && company.images?.background) {
            heroImage.src = company.images.background;
            heroImage.alt = `${company.name}のメイン画像`;
        }
        
        // 企業画像
        const companyImage = document.getElementById('companyImage');
        if (companyImage && company.images?.background) {
            companyImage.src = company.images.background;
            companyImage.alt = `${company.name}の蔵`;
        }
        
        // ロゴの更新（ヘッダー）
        this.updateLogo();
    }
    
    /**
     * ロゴ更新
     */
    updateLogo() {
        const company = this.companyData.company;
        if (!company.images?.logo) return;
        
        const logoH1 = document.querySelector('.logo h1');
        if (logoH1) {
            // ロゴ画像がある場合は背景画像として設定
            logoH1.style.backgroundImage = `url(${company.images.logo})`;
            logoH1.style.backgroundSize = 'contain';
            logoH1.style.backgroundRepeat = 'no-repeat';
            logoH1.style.backgroundPosition = 'center';
            logoH1.style.height = '60px';
            logoH1.style.textIndent = '-9999px';
        }
    }
    
    /**
     * 自動化システム実行
     */
    async runAutomationSystems() {
        console.log('Running automation systems...');
        
        try {
            // 視覚的ブランディング自動化
            if (window.VisualBrandingAutomation) {
                const branding = new window.VisualBrandingAutomation();
                const logoUrl = this.companyData.company.images?.logo;
                if (logoUrl) {
                    await branding.generateBrandingTheme(logoUrl, 'sake');
                }
            }
            
            // SEO最適化
            if (window.SEOMultilingualOptimization) {
                const seo = new window.SEOMultilingualOptimization();
                await seo.optimizeSEOAndMultilingual(
                    this.companyData, 
                    'sake', 
                    this.companyData.websiteUrl
                );
            }
            
            console.log('Automation systems completed');
            
        } catch (error) {
            console.error('Automation systems error:', error);
        }
    }
    
    /**
     * イベントリスナー設定
     */
    setupEventListeners() {
        // スムーススクロール
        this.setupSmoothScroll();
        
        // レスポンシブナビゲーション
        this.setupResponsiveNav();
        
        // モバイルハンバーガーメニュー
        this.setupMobileMenu();
        
        // 言語切替
        this.setupLanguageSwitcher();
        
        // 商品カテゴリフィルター
        this.setupProductFilter();
        
        // 商品タブ機能
        this.setupProductTabs();
        
        // 商品詳細展開機能
        this.setupProductDetailsToggle();
        
        // AIサクラセクション機能
        this.setupAISakuraSection();
        
        // チャットボタンスクロール追従
        this.setupChatButtonScrollBehavior();
    }
    
    /**
     * スムーススクロール設定
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    /**
     * レスポンシブナビゲーション設定
     */
    setupResponsiveNav() {
        // モバイルメニューボタンがある場合の処理
        const navToggle = document.querySelector('.nav-toggle');
        const nav = document.querySelector('.nav ul');
        
        if (navToggle && nav) {
            navToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
        }
    }
    
    /**
     * モバイルハンバーガーメニュー設定
     */
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
        
        if (!mobileMenuToggle || !mobileMenuOverlay || !mobileMenuClose) {
            console.warn('Mobile menu elements not found');
            return;
        }
        
        // ハンバーガーメニューボタンクリック
        mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu(true);
        });
        
        // メニュー閉じるボタンクリック
        mobileMenuClose.addEventListener('click', () => {
            this.toggleMobileMenu(false);
        });
        
        // オーバーレイクリックで閉じる
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                this.toggleMobileMenu(false);
            }
        });
        
        // メニューリンククリックで閉じる
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.toggleMobileMenu(false);
            });
        });
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
                this.toggleMobileMenu(false);
            }
        });
        
        console.log('Mobile hamburger menu initialized');
    }
    
    /**
     * モバイルメニューの開閉
     */
    toggleMobileMenu(open) {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        
        if (open) {
            mobileMenuToggle.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // スクロール無効化
        } else {
            mobileMenuToggle.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // スクロール復活
        }
    }
    
    /**
     * 言語切替設定
     */
    setupLanguageSwitcher() {
        // Google Translateとの連携
        window.addEventListener('DOMContentLoaded', () => {
            const observer = new MutationObserver(() => {
                const googleFrame = document.querySelector('.goog-te-banner-frame');
                if (googleFrame) {
                    this.handleLanguageChange();
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    
    /**
     * 商品フィルター設定
     */
    setupProductFilter() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                
                // アクティブボタンの切り替え
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // 商品の表示・非表示
                this.filterProducts(category, productCards);
            });
        });
    }
    
    /**
     * 商品フィルタリング
     */
    filterProducts(category, productCards) {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                // アニメーション効果
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }, 300);
            }
        });
        
        // グリッドレイアウトの再計算
        setTimeout(() => {
            const productsGrid = document.getElementById('productsGrid');
            if (productsGrid) {
                productsGrid.style.animation = 'none';
                productsGrid.offsetHeight; // リフロー強制
                productsGrid.style.animation = null;
            }
        }, 400);
    }
    
    /**
     * 言語変更処理
     */
    handleLanguageChange() {
        // AIチャットボットに言語変更を通知
        if (window.aiChatbot) {
            const currentLang = this.detectCurrentLanguage();
            window.aiChatbot.setLanguage(currentLang);
        }
    }
    
    /**
     * 現在の言語を検出
     */
    detectCurrentLanguage() {
        const googleTranslateFrame = document.querySelector('.goog-te-banner-frame');
        if (googleTranslateFrame) {
            const frameDoc = googleTranslateFrame.contentDocument;
            if (frameDoc) {
                const selectElement = frameDoc.querySelector('select');
                if (selectElement) {
                    return selectElement.value || 'ja';
                }
            }
        }
        return 'ja';
    }
    
    /**
     * 商品タブ機能設定
     */
    setupProductTabs() {
        // 各商品カード内のタブボタンにイベントリスナーを追加
        document.querySelectorAll('.product-tab-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const tabName = button.getAttribute('data-tab');
                const productCard = button.closest('.product-card');
                
                if (!productCard || !tabName) return;
                
                // 同じ商品カード内のタブボタンのアクティブ状態を更新
                const tabButtons = productCard.querySelectorAll('.product-tab-btn');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // 同じ商品カード内のタブコンテンツを更新
                const tabPanes = productCard.querySelectorAll('.tab-pane');
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.getAttribute('data-tab') === tabName) {
                        pane.classList.add('active');
                    }
                });
                
                // アニメーション効果
                const activePane = productCard.querySelector(`.tab-pane[data-tab="${tabName}"]`);
                if (activePane) {
                    activePane.style.opacity = '0';
                    activePane.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        activePane.style.transition = 'all 0.3s ease-in-out';
                        activePane.style.opacity = '1';
                        activePane.style.transform = 'translateY(0)';
                    }, 10);
                }
            });
        });
        
        console.log('Product tabs initialized');
    }
    
    /**
     * 商品詳細展開・収納機能設定
     */
    setupProductDetailsToggle() {
        // 全ての商品詳細を初期状態では非表示にする
        document.querySelectorAll('.product-details-content').forEach(content => {
            content.classList.remove('expanded');
        });
        
        // グローバル関数として定義
        window.toggleProductDetails = (productCard) => {
            const detailsContent = productCard.querySelector('.product-details-content');
            const toggleButton = productCard.querySelector('.product-details-toggle');
            const toggleIcon = toggleButton.querySelector('.toggle-icon');
            
            if (detailsContent.classList.contains('expanded')) {
                // 収納
                detailsContent.classList.remove('expanded');
                toggleButton.classList.remove('expanded');
                toggleButton.innerHTML = '詳細を見る <span class="toggle-icon">▼</span>';
            } else {
                // 展開
                detailsContent.classList.add('expanded');
                toggleButton.classList.add('expanded');
                toggleButton.innerHTML = '詳細を閉じる <span class="toggle-icon">▲</span>';
                
                // スムーズスクロール
                setTimeout(() => {
                    productCard.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 300);
            }
        };
        
        console.log('Product details toggle initialized');
    }
    
    /**
     * AIサクラセクション機能設定
     */
    setupAISakuraSection() {
        // AIサクラチャット開始関数
        window.openAISakuraChat = () => {
            console.log('openAISakuraChat called');
            
            // modernChatbot インスタンスを確認
            if (window.modernChatbot) {
                console.log('modernChatbot found, opening chat...');
                window.modernChatbot.openChat();
                
                // セクションからチャットエリアにスムーズスクロール
                setTimeout(() => {
                    const chatInterface = document.getElementById('chatInterface');
                    if (chatInterface) {
                        chatInterface.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }
                }, 300);
            } else if (window.aiChatbot) {
                // フォールバック: 古い名前での確認
                console.log('aiChatbot found, opening chat...');
                window.aiChatbot.openChat();
            } else {
                console.error('No chatbot instance found');
                console.log('Available instances:', {
                    modernChatbot: !!window.modernChatbot,
                    aiChatbot: !!window.aiChatbot,
                    aiConfig: !!window.aiConfig
                });
                
                // エラーメッセージを表示
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #ff4444;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    font-size: 14px;
                `;
                errorDiv.textContent = 'チャットボットの初期化に失敗しました。ページを再読み込みしてください。';
                document.body.appendChild(errorDiv);
                
                setTimeout(() => errorDiv.remove(), 5000);
            }
        };
        
        // 例示質問関数
        window.askExample = (question) => {
            console.log('askExample called with:', question);
            
            if (window.modernChatbot) {
                // チャットを開く
                window.modernChatbot.openChat();
                
                // 質問を入力欄に設定
                setTimeout(() => {
                    const messageInput = document.getElementById('messageInput');
                    if (messageInput) {
                        messageInput.value = question;
                        messageInput.focus();
                        
                        // 自動送信
                        setTimeout(() => {
                            window.modernChatbot.sendMessage();
                        }, 500);
                    }
                }, 300);
            } else if (window.aiChatbot) {
                // フォールバック
                window.aiChatbot.openChat();
                setTimeout(() => {
                    const messageInput = document.getElementById('messageInput');
                    if (messageInput) {
                        messageInput.value = question;
                        messageInput.focus();
                        setTimeout(() => {
                            window.aiChatbot.sendMessage();
                        }, 500);
                    }
                }, 300);
            } else {
                console.error('No chatbot instance found');
            }
        };
        
        console.log('AI Sakura section initialized');
        
        // フォールバック: ボタンに直接イベントリスナーも追加
        const mainChatButton = document.getElementById('mainChatButton');
        if (mainChatButton) {
            mainChatButton.addEventListener('click', function(e) {
                console.log('Main chat button clicked (event listener)');
                // onclickが動作しない場合のフォールバック
                if (typeof window.openAISakuraChat === 'function') {
                    window.openAISakuraChat();
                } else {
                    console.error('openAISakuraChat function not found');
                }
            });
            console.log('Main chat button event listener added');
        }
    }
    
    /**
     * チャットボタンスクロール追従設定
     */
    setupChatButtonScrollBehavior() {
        const chatButton = document.getElementById('chatButton');
        if (!chatButton) return;
        
        let lastScrollY = window.scrollY;
        let isScrolling = false;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const footerHeight = 100; // フッターのチャットボタン用スペース
            
            // フッター付近にいるかチェック
            const isNearFooter = (currentScrollY + windowHeight) >= (documentHeight - footerHeight);
            
            // スクロール方向を検出
            const isScrollingDown = currentScrollY > lastScrollY;
            
            if (isNearFooter) {
                // フッター付近では少し控えめに表示
                chatButton.classList.add('hide-on-bottom');
            } else {
                chatButton.classList.remove('hide-on-bottom');
            }
            
            // スクロール時にチャットボタンを一時的に小さくする
            if (!isScrolling) {
                chatButton.style.transform = 'scale(0.9)';
                isScrolling = true;
                
                // スクロール停止時に元のサイズに戻す
                clearTimeout(this.scrollTimeout);
                this.scrollTimeout = setTimeout(() => {
                    chatButton.style.transform = '';
                    isScrolling = false;
                }, 150);
            }
            
            lastScrollY = currentScrollY;
        };
        
        // スクロールイベントをスロットル
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
                setTimeout(() => {
                    ticking = false;
                }, 16); // 60fps相当
            }
        });
        
        console.log('Chat button scroll behavior initialized');
    }
    
    /**
     * エラーメッセージ表示
     */
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    /**
     * 成功メッセージ表示
     */
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #44aa44;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    /**
     * デバッグ情報取得
     */
    getDebugInfo() {
        return {
            initialized: this.initialized,
            companyName: this.companyData?.company?.name,
            businessType: this.companyData?.businessType,
            productsCount: this.companyData?.products?.length,
            aiChatbotReady: !!window.aiChatbot,
            companyManagerReady: !!window.companyManager
        };
    }
}

// グローバルアクセス用
window.TakenamiSAKElink = TakenamiSAKElink;

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    window.takenamiSAKElink = new TakenamiSAKElink();
});

// デバッグ用コンソールコマンド
if (typeof console !== 'undefined') {
    window.debugTakenami = function() {
        if (window.takenamiSAKElink) {
            console.log('Takenami SAKElink Debug Info:', window.takenamiSAKElink.getDebugInfo());
        } else {
            console.log('Takenami SAKElink not initialized');
        }
    };
}