'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('zh-TW');

    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) {
            setLanguage(savedLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'zh-TW' ? 'en' : 'zh-TW';
        setLanguage(newLang);
        localStorage.setItem('app_language', newLang);
    };

    const t = (key, ...args) => {
        let text = translations[language][key] || key;
        args.forEach(arg => {
            text = text.replace('%s', arg);
        });
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
