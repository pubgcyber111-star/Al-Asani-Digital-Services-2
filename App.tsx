import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Header } from './components/Header';
import { CategoriesBar } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ServicePage } from './components/ServicePage';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { WelcomeModal } from './components/WelcomeModal';
import { ContentProtector } from './components/ContentProtector';
import { Watermark } from './components/Watermark';
import { Service, Category, ChatMessage } from './types';
import { INITIAL_SERVICES, INITIAL_CATEGORIES, ADMIN_PASSCODE, DEFAULT_LOGO_URL, DEFAULT_WATERMARK_TEXT, WHATSAPP_NUMBER } from './constants';
import { initDB, getAll, replaceAll, getSetting, saveSetting, addSuggestion } from './db';

const ITEMS_PER_PAGE = 8;

// --- AI Assistant Sub-components ---
const ModelMessage: React.FC<{
    fullText: string;
    isLastMessage: boolean;
    renderMessageContent: (text: string) => React.ReactNode;
}> = ({ fullText, isLastMessage, renderMessageContent }) => {
    const [displayedText, setDisplayedText] = useState(isLastMessage ? '' : fullText);
    const hasAnimated = useRef(!isLastMessage);

    useEffect(() => {
        if (!hasAnimated.current) {
            hasAnimated.current = true;
            let index = 0;
            const typeCharacter = () => {
                if (index < fullText.length) {
                    setDisplayedText(prev => prev + fullText[index]);
                    index++;
                    const char = fullText[index - 1];
                    // Variable speed: 10-20 chars/sec (50ms to 100ms delay)
                    let delay = Math.random() * (100 - 50) + 50; 
                    if (['.', '!', '?'].includes(char)) {
                        delay += 300; // Natural pause at the end of a sentence
                    } else if (char === ',') {
                        delay += 150; // Natural pause for a comma
                    }
                    setTimeout(typeCharacter, delay);
                }
            };
            setTimeout(typeCharacter, 500); // Initial delay before typing starts
        }
    }, [fullText, isLastMessage]);

    return (
        <div className="text-sm whitespace-pre-wrap">
            {renderMessageContent(displayedText)}
        </div>
    );
};


// --- AI Assistant Component ---
const AIAssistant: React.FC<{ services: Service[]; onSelectService: (id: number) => void; }> = ({ services, onSelectService }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'أهلاً بك! أنا مساعدك الذكي في متجر العساني للخدمات الرقمية. كيف يمكنني مساعدتك في العثور على الخدمة المثالية لك اليوم؟' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // State and Refs for "living" animation
    const [animationClass, setAnimationClass] = useState('animate-subtle-bounce');
    const [isHovered, setIsHovered] = useState(false);
    const idleTimerRef = useRef<number | null>(null);
    const sequenceTimersRef = useRef<number[]>([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);
    
    // --- Living Animation Logic ---
    const clearAllAnimationTimeouts = () => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
        sequenceTimersRef.current.forEach(clearTimeout);
        sequenceTimersRef.current = [];
    };
    
    const startIdleAnimation = () => {
        clearAllAnimationTimeouts();
    
        const timeouts: number[] = [];
    
        // Sequence of animations
        timeouts.push(window.setTimeout(() => setAnimationClass('animate-look-right'), 0)); // look right (1.5s)
        timeouts.push(window.setTimeout(() => setAnimationClass('animate-look-right-return'), 1500 + 1000)); // hold (1s), return (1.5s)
        timeouts.push(window.setTimeout(() => setAnimationClass('animate-subtle-bounce'), 1500 + 1000 + 1500)); // back to center
        timeouts.push(window.setTimeout(() => setAnimationClass('animate-look-left'), 1500 + 1000 + 1500 + 1000)); // wait (1s), look left (1.5s)
        timeouts.push(window.setTimeout(() => setAnimationClass('animate-look-left-return'), 1500 + 1000 + 1500 + 1000 + 1500 + 1000)); // hold (1s), return (1.5s)
        timeouts.push(window.setTimeout(() => setAnimationClass('animate-subtle-bounce'), 1500 + 1000 + 1500 + 1000 + 1500 + 1000 + 1500)); // back to center
        timeouts.push(window.setTimeout(() => setAnimationClass('animate-blink'), 1500 + 1000 + 1500 + 1000 + 1500 + 1000 + 1500 + 500)); // wait (0.5s), blink (0.5s)
    
        const totalDuration = 10500; 
        timeouts.push(window.setTimeout(() => {
            setAnimationClass('animate-subtle-bounce');
            // Schedule the next full animation sequence after a long pause
            idleTimerRef.current = window.setTimeout(startIdleAnimation, 30000); 
        }, totalDuration));
    
        sequenceTimersRef.current = timeouts;
    };

    useEffect(() => {
        // Stop animation if chat is open or button is hovered
        if (isOpen || isHovered) {
            clearAllAnimationTimeouts();
            setAnimationClass(''); // Reset animation state
            return;
        }
    
        // Start the animation loop after an initial delay when idle
        idleTimerRef.current = window.setTimeout(startIdleAnimation, 5000);
    
        // Cleanup function to clear timeouts when component unmounts or state changes
        return () => {
            clearAllAnimationTimeouts();
        };
    }, [isOpen, isHovered]);
    // --- End of Animation Logic ---

    const renderMessageContent = (text: string) => {
        const regex = /\[WHATSAPP_BUTTON_FOR_SERVICE_ID=(\d+)\]/g;
        const parts = text.split(regex);

        if (parts.length <= 1) {
            return text; // No tags found, return original text
        }

        return (
            <>
                {parts.map((part, index) => {
                    if (index % 2 === 0) {
                        // It's a text part
                        return <span key={`text-${index}`}>{part}</span>;
                    } else {
                        // It's a service ID part
                        const serviceId = parseInt(part, 10);
                        const service = services.find(s => s.id === serviceId);
                        if (service) {
                            const message = `مرحباً، أنا مهتم بطلب خدمة '${service.name}'.\nرقم مرجع الخدمة: ${service.id}`;
                            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                            return (
                                <a
                                    key={`button-${serviceId}-${index}`}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ backgroundColor: '#25D366' }}
                                    className="mt-2 block w-full text-center text-white py-2 px-4 rounded-lg font-bold transition-transform duration-200 hover:scale-105 shadow hover:brightness-110 text-sm"
                                >
                                    <i className="fab fa-whatsapp mr-2"></i> اطلب الخدمة عبر واتساب
                                </a>
                            );
                        }
                        return null;
                    }
                })}
            </>
        );
    };


    const handleSendMessage = async (query?: string) => {
        const userMessage = query || input;
        if (!userMessage.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const servicesContext = JSON.stringify(services.map(s => ({
                id: s.id,
                name: s.name,
                description: s.shortDescription,
                price: `${s.price} ${s.currency}`,
                features: s.features
            })));

            const systemInstruction = `أنت المساعد الذكي لمتجر خدمات رقمية اسمه "العساني للخدمات الرقمية".
مهمتك الأساسية هي مساعدة المستخدمين في العثور على الخدمة الرقمية المثالية من القائمة المتوفرة.

**قواعد التواصل:**
1.  **الهوية:** هويتك ثابتة. أنت "المساعد الذكي لمتجر العساني للخدمات الرقمية". لا تخترع أي اسم أو هوية أخرى.
2.  **مصدر المعلومات:** استخدم فقط المعلومات من قائمة الخدمات المتوفرة أدناه. لا تخترع خدمات أو أسعار.
3.  **عرض الخدمات:** قدم الخدمات بوضوح. لكل خدمة، اذكر اسمها، وصفها القصير، وسعرها. استخدم الماركداون للتنسيق.
4.  **الرقم المرجعي:** عند ذكر أي خدمة، قم دائمًا بتضمين معرفها بهذا التنسيق: \`(الرقم المرجعي: ID)\`. مثال: \`(الرقم المرجعي: 123)\`.
5.  **تأكيد الطلب:** إذا عبر المستخدم بوضوح عن نيته لشراء أو طلب خدمة معينة، قم بتضمين علامة خاصة لإنشاء زر طلب عبر واتساب: \`[WHATSAPP_BUTTON_FOR_SERVICE_ID=SERVICE_ID]\`. لا تستخدم هذا الزر للاستفسارات العامة.
6.  **اللغة:** يجب أن تكون جميع الاتصالات باللغة العربية.

**قاعدة مهمة جداً - التعامل مع الخدمات غير الموجودة:**
- إذا سأل المستخدم عن خدمة غير موجودة في قائمة الخدمات (JSON)، فهذه فرصة ممتازة لجمع ملاحظات العملاء.
- **لا تقل "لا يمكنني المساعدة" أو "هذه الخدمة غير متوفرة".**
- بدلاً من ذلك، اتبع الخطوات التالية بدقة:
    1.  قدم إجابة مطمئنة ومهذبة. مثال: "شكرًا لاهتمامك! خدمة [اسم الخدمة المطلوبة] ليست ضمن خدماتنا الحالية، ولكنها فكرة رائعة. لقد قمنا بتسجيل طلبك وسننظر في إمكانية إضافتها قريبًا."
    2.  **الأهم:** في نهاية ردك، يجب أن تضيف علامة خاصة لتسجيل هذا الاقتراح. تنسيق العلامة هو: \`[NEW_SERVICE_SUGGESTION: 'اسم الخدمة المقترحة']\`.
- **مثال عملي:**
    - استعلام المستخدم: "هل تقدمون خدمة كتابة السيرة الذاتية؟"
    - استجابتك الصحيحة: "شكرًا لاهتمامك! خدمة كتابة السيرة الذاتية ليست ضمن خدماتنا الحالية، ولكنها فكرة رائعة. لقد قمنا بتسجيل طلبك وسننظر في إمكانية إضافتها قريبًا. [NEW_SERVICE_SUGGESTION: 'كتابة السيرة الذاتية']"

إليك قائمة الخدمات المتاحة بصيغة JSON:
${servicesContext}`;
            
            const chatHistory = messages.slice(1).map(msg => ({ // Exclude initial welcome message
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

            const contents = [
                 ...chatHistory,
                { role: 'user', parts: [{ text: userMessage }] }
            ];

            const responseStream = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents,
                config: { systemInstruction },
            });
            
            let fullResponse = '';
            for await (const chunk of responseStream) {
                fullResponse += chunk.text;
            }
            
            setIsLoading(false);

            if (fullResponse) {
                const suggestionRegex = /\[NEW_SERVICE_SUGGESTION: '(.*?)'\]/;
                const match = fullResponse.match(suggestionRegex);

                if (match && match[1]) {
                    const suggestionName = match[1];
                    await addSuggestion({ name: suggestionName, requestedAt: Date.now() });
                    // Clean the tag from the response before showing it to the user
                    fullResponse = fullResponse.replace(suggestionRegex, '').trim();
                }

                 setMessages(prev => [...prev, { role: 'model', text: fullResponse }]);
            }

        } catch (error) {
            console.error("Gemini API Error:", error);
            setIsLoading(false);
            setMessages(prev => [...prev, { role: 'model', text: 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.' }]);
        }
    };

    const handleTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Prevent navigation if the user clicks the WhatsApp button
        if ((e.target as HTMLElement).closest('a[href*="whatsapp.com"]')) {
            return;
        }

        const text = (e.target as HTMLElement).innerText;
        const match = text.match(/الرقم المرجعي: (\d+)/);
        if (match && match[1]) {
            const serviceId = parseInt(match[1], 10);
            const serviceExists = services.some(s => s.id === serviceId);
            if (serviceExists) {
                onSelectService(serviceId);
                setIsOpen(false);
            }
        }
    }

    return (
        <div className="fixed bottom-5 left-5 z-[999]">
            {/* Chat Window */}
            <div className={`ai-chat-container ${isOpen ? 'open' : 'closed'} absolute bottom-20 left-0 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300`}>
                <header className="bg-gray-100 p-3 rounded-t-xl flex justify-between items-center border-b">
                    <h3 className="font-bold text-gray-800">المساعد الذكي</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">&times;</button>
                </header>
                <div className="flex-grow h-96 overflow-y-auto p-4 space-y-4" onClick={handleTextClick}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'ai-message-user rounded-br-lg' : 'ai-message-model rounded-bl-lg'}`}>
                                {msg.role === 'model' ? (
                                    <ModelMessage
                                        fullText={msg.text}
                                        isLastMessage={index === messages.length - 1}
                                        renderMessageContent={renderMessageContent}
                                    />
                                ) : (
                                    <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="rounded-2xl px-4 py-3 ai-message-model rounded-bl-lg">
                                <div className="live-typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-2 border-t text-xs text-center text-gray-400">
                    قد يقدم الذكاء الاصطناعي معلومات غير دقيقة.
                </div>
                <div className="p-3 border-t">
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="اسأل عن خدمة..."
                            className="flex-grow p-2 border rounded-full text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-[#3482b5] text-white rounded-full w-10 h-10 flex-shrink-0 hover:bg-[#2c6a94] transition-colors" disabled={isLoading}>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`ai-fab ${isOpen ? 'open' : ''} w-16 h-16 bg-[#3482b5] rounded-full shadow-lg text-white text-2xl flex items-center justify-center transition-transform duration-300 hover:bg-[#2c6a94]`}
                aria-label="Open AI Assistant"
            >
                {isOpen ? (
                    <i className="fas fa-times"></i>
                ) : (
                    <div className={`relative w-full h-full flex items-center justify-center ${animationClass}`}>
                         <div className="ai-fab-robot-container">
                             <i className="fas fa-robot"></i>
                             <div className="ai-fab-eye"></div>
                         </div>
                    </div>
                )}
            </button>
        </div>
    );
};


const App: React.FC = () => {
    // State declarations
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [isDbLoaded, setIsDbLoaded] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [page, setPage] = useState(1);
    const [servicesLayout, setServicesLayout] = useState<'grid' | 'list'>('grid');

    // Settings state
    const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO_URL);
    const [isProtectionEnabled, setIsProtectionEnabled] = useState<boolean>(true);
    const [isAnimationEnabled, setIsAnimationEnabled] = useState<boolean>(true);
    const [isWatermarkEnabled, setIsWatermarkEnabled] = useState<boolean>(true);
    const [watermarkText, setWatermarkText] = useState<string>(DEFAULT_WATERMARK_TEXT);
    
    // DB Initialization and data loading
    useEffect(() => {
        const loadData = async () => {
            await initDB();
            
            const dbInitialized = await getSetting<boolean>('db_initialized');

            if (dbInitialized) {
                // Database is already seeded, load directly from it
                const [storedServices, storedCategories, storedLogo, storedProtection, storedAnimation, storedWatermark, storedWatermarkText] = await Promise.all([
                    getAll<Service>('services'),
                    getAll<Category>('categories'),
                    getSetting<string>('logoUrl'),
                    getSetting<boolean>('isProtectionEnabled'),
                    getSetting<boolean>('isAnimationEnabled'),
                    getSetting<boolean>('isWatermarkEnabled'),
                    getSetting<string>('watermarkText')
                ]);
                setServices(storedServices);
                setCategories(storedCategories);
                setLogoUrl(storedLogo ?? DEFAULT_LOGO_URL);
                setIsProtectionEnabled(storedProtection ?? true);
                setIsAnimationEnabled(storedAnimation ?? true);
                setIsWatermarkEnabled(storedWatermark ?? true);
                setWatermarkText(storedWatermarkText ?? DEFAULT_WATERMARK_TEXT);
            } else {
                // First run: seed the database from data.json or fallbacks
                let sourceServices = INITIAL_SERVICES;
                let sourceCategories = INITIAL_CATEGORIES;
                let sourceSettings = {
                    logoUrl: DEFAULT_LOGO_URL,
                    isProtectionEnabled: true,
                    isAnimationEnabled: true,
                    isWatermarkEnabled: true,
                    watermarkText: DEFAULT_WATERMARK_TEXT,
                };

                try {
                    const response = await fetch('./data.json');
                    if (!response.ok) throw new Error('Response not OK');
                    const data = await response.json();
                    
                    if (data.services && data.categories && data.settings) {
                        sourceServices = data.services;
                        sourceCategories = data.categories;
                        sourceSettings = { ...sourceSettings, ...data.settings };
                        console.log('Seeding database from ./data.json');
                    } else {
                         throw new Error('Invalid data.json structure');
                    }
                } catch (error) {
                    console.warn('Failed to fetch ./data.json, seeding database from initial constants.', error);
                }

                // Update state
                setServices(sourceServices);
                setCategories(sourceCategories);
                setLogoUrl(sourceSettings.logoUrl);
                setIsProtectionEnabled(sourceSettings.isProtectionEnabled);
                setIsAnimationEnabled(sourceSettings.isAnimationEnabled);
                setIsWatermarkEnabled(sourceSettings.isWatermarkEnabled);
                setWatermarkText(sourceSettings.watermarkText);

                // Save to DB
                await Promise.all([
                    replaceAll('services', sourceServices),
                    replaceAll('categories', sourceCategories),
                    saveSetting('logoUrl', sourceSettings.logoUrl),
                    saveSetting('isProtectionEnabled', sourceSettings.isProtectionEnabled),
                    saveSetting('isAnimationEnabled', sourceSettings.isAnimationEnabled),
                    saveSetting('isWatermarkEnabled', sourceSettings.isWatermarkEnabled),
                    saveSetting('watermarkText', sourceSettings.watermarkText),
                    saveSetting('db_initialized', true) // Mark as initialized
                ]);
            }
            
            const hasVisited = localStorage.getItem('hasVisitedAlAsaniStore');
            if (!hasVisited) {
                setShowWelcome(true);
                localStorage.setItem('hasVisitedAlAsaniStore', 'true');
            }
            
            setIsDbLoaded(true);
        };

        loadData().catch(console.error);
    }, []);
    
    // Save collections to DB
    useEffect(() => {
        if (!isDbLoaded) return;
        const handler = setTimeout(() => {
            replaceAll('services', services).catch(console.error);
            replaceAll('categories', categories).catch(console.error);
        }, 500);
        return () => clearTimeout(handler);
    }, [services, categories, isDbLoaded]);

    // Save settings to DB
    const useDebouncedSettingSave = (key: string, value: any) => {
        useEffect(() => {
            if (!isDbLoaded) return;
            const handler = setTimeout(() => {
                saveSetting(key, value).catch(console.error);
            }, 500);
            return () => clearTimeout(handler);
        }, [key, value, isDbLoaded]);
    };
    
    useDebouncedSettingSave('logoUrl', logoUrl);
    useDebouncedSettingSave('isProtectionEnabled', isProtectionEnabled);
    useDebouncedSettingSave('isAnimationEnabled', isAnimationEnabled);
    useDebouncedSettingSave('isWatermarkEnabled', isWatermarkEnabled);
    useDebouncedSettingSave('watermarkText', watermarkText);


    // Admin handlers
    const handleLogin = (passcode: string): boolean => {
        if (passcode === ADMIN_PASSCODE) {
            setIsAdmin(true);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setIsAdmin(false);
    };

    // Service and Category handlers
    const handleSelectService = (id: number) => {
        setSelectedServiceId(id);
        window.scrollTo(0, 0);
    };

    const handleBackToServices = () => {
        setSelectedServiceId(null);
    };
    
    // CRUD Operations
    const handleAddService = (service: Omit<Service, 'id' | 'createdAt' | 'author'>) => {
        const newService: Service = {
            ...service,
            id: Date.now(),
            createdAt: Date.now(),
            author: 'Al-Asani for Digital Services'
        };
        setServices(prev => [newService, ...prev]);
    };

    const handleUpdateService = (updatedService: Service) => {
        setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
    };

    const handleDeleteService = (id: number) => {
        // Confirmation is now handled in the UI (AdminPanel) to avoid window.confirm issues.
        setServices(prev => prev.filter(s => s.id !== id));
    };
    
     const handleAddCategory = (category: Omit<Category, 'id'>) => {
        const newCategory: Category = { ...category, id: Date.now() };
        setCategories(prev => [...prev, newCategory]);
    };

    const handleUpdateCategory = (updatedCategory: Category) => {
        setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    };

    const handleDeleteCategory = (id: number) => {
        // Confirmation is now handled in the UI (AdminPanel) to be consistent and reliable.
        setServices(prevServices => prevServices.map(s => ({
            ...s,
            categoryIds: s.categoryIds.filter(catId => catId !== id)
        })));
        setCategories(prev => prev.filter(c => c.id !== id));
    };
    
    // Reset page when category changes
    useEffect(() => {
        setPage(1);
    }, [selectedCategoryId]);

    // Memoized derived state
    const filteredServices = useMemo(() => {
        if (!selectedCategoryId) return services;
        return services.filter(service => service.categoryIds.includes(selectedCategoryId));
    }, [services, selectedCategoryId]);

    const servicesToDisplay = useMemo(() => {
        return filteredServices.slice(0, page * ITEMS_PER_PAGE);
    }, [filteredServices, page]);

    const hasMoreServices = useMemo(() => {
        return servicesToDisplay.length < filteredServices.length;
    }, [servicesToDisplay.length, filteredServices.length]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };



    const selectedService = useMemo(() => {
        return services.find(s => s.id === selectedServiceId) || null;
    }, [services, selectedServiceId]);

    if (!isDbLoaded) {
        return <div className="fixed inset-0 bg-white flex items-center justify-center text-xl font-bold text-gray-700">جاري تحميل المتجر...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-tajawal" dir="rtl">
            <ContentProtector isProtected={isProtectionEnabled} />
            <Watermark isProtected={isProtectionEnabled && isWatermarkEnabled} text={watermarkText} />
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} logoUrl={logoUrl} />}

            <Header onSearch={handleLogin} isAdmin={isAdmin} logoUrl={logoUrl} />

            <main className="flex-grow">
                {selectedService ? (
                    <ServicePage 
                        service={selectedService} 
                        onBack={handleBackToServices}
                        isWatermarkEnabled={isProtectionEnabled && isWatermarkEnabled}
                        watermarkText={watermarkText}
                        logoUrl={logoUrl}
                    />
                ) : (
                    <>
                        <CategoriesBar 
                            categories={categories} 
                            onSelectCategory={setSelectedCategoryId}
                            selectedCategoryId={selectedCategoryId}
                            isAnimationEnabled={isAnimationEnabled}
                        />
                        <ServicesSection 
                            services={servicesToDisplay} 
                            onSelectService={handleSelectService}
                            isWatermarkEnabled={isProtectionEnabled && isWatermarkEnabled}
                            watermarkText={watermarkText}
                            logoUrl={logoUrl}
                            onLoadMore={handleLoadMore}
                            hasMore={hasMoreServices}
                            layout={servicesLayout}
                            onLayoutChange={setServicesLayout}
                        />
                    </>
                )}

                {isAdmin && (
                    <AdminPanel
                        services={services}
                        categories={categories}
                        onAddService={handleAddService}
                        onUpdateService={handleUpdateService}
                        onDeleteService={handleDeleteService}
                        onAddCategory={handleAddCategory}
                        onUpdateCategory={handleUpdateCategory}
                        onDeleteCategory={handleDeleteCategory}
                        onLogout={handleLogout}
                        logoUrl={logoUrl}
                        onSetLogoUrl={setLogoUrl}
                        isProtectionEnabled={isProtectionEnabled}
                        onSetProtection={setIsProtectionEnabled}
                        isAnimationEnabled={isAnimationEnabled}
                        onSetAnimation={setIsAnimationEnabled}
                        isWatermarkEnabled={isWatermarkEnabled}
                        onSetWatermark={setIsWatermarkEnabled}
                        watermarkText={watermarkText}
                        onSetWatermarkText={setWatermarkText}
                    />
                )}
            </main>

            <Footer />
            {isDbLoaded && <AIAssistant services={services} onSelectService={handleSelectService} />}
        </div>
    );
};

export default App;