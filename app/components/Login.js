'use client';
import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
    const [name, setName] = useState('');
    const { join } = useGame();
    const { t, toggleLanguage, language } = useLanguage();

    useEffect(() => {
        const storedName = localStorage.getItem('exchange_user_name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) join(name);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[var(--md-sys-color-background)]">
            <div className="absolute top-4 right-4">
                <button
                    onClick={toggleLanguage}
                    className="btn-text flex items-center gap-2"
                >
                    <span className="material-icons">language</span>
                    {language === 'zh-TW' ? 'English' : '中文'}
                </button>
            </div>

            <div className="card max-w-md w-full text-center animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--md-sys-color-primary)]"></div>

                <h1 className="text-3xl font-bold mb-2 text-[var(--md-sys-color-primary)]">
                    {t('login.title')}
                </h1>
                <p className="mb-8 text-[var(--md-sys-color-on-surface-variant)]">
                    {t('login.subtitle')}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('login.placeholder')}
                            className="input-field"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full shadow-lg shadow-[var(--md-sys-color-primary)]/20">
                        {t('login.button')}
                    </button>
                </form>
            </div>
        </div>
    );
}
