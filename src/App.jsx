import React, { useState, useEffect } from 'react';
import { Settings, BrainCircuit } from 'lucide-react';
import Sidebar from './components/Sidebar';
import QuizConfig from './components/QuizConfig';
import QuizDisplay from './components/QuizDisplay';
import { generateQuiz } from './services/api';

const DEFAULT_CONFIG = {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: '',
    modelName: 'gemini-1.5-flash',
};

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [config, setConfig] = useState(() => {
        const saved = localStorage.getItem('mathGenieConfig');
        return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    });

    const handleSaveConfig = (newConfig) => {
        setConfig(newConfig);
        localStorage.setItem('mathGenieConfig', JSON.stringify(newConfig));
        setIsSidebarOpen(false);
    };

    const [activeQuiz, setActiveQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerateQuiz = async (params) => {
        setLoading(true);
        setError(null);
        console.log("Generating quiz with params:", params);

        try {
            const questions = await generateQuiz(config, params);
            setActiveQuiz(questions);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to generate quiz. Please check your API key and settings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            MathGenie AI
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="hidden sm:inline">Settings</span>
                    </button>
                </div>
            </header>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                config={config}
                onSave={handleSaveConfig}
            />

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                    </div>
                )}
                {!config.apiKey ? (
                    <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BrainCircuit className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to MathGenie</h2>
                        <p className="text-slate-600 mb-6">
                            Please click the settings button to configure your API Key and Model to start generating math quizzes.
                        </p>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            Configure Now
                        </button>
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto">
                        {!activeQuiz ? (
                            <QuizConfig onGenerate={handleGenerateQuiz} isLoading={loading} />
                        ) : (
                            <QuizDisplay
                                questions={activeQuiz}
                                onBack={() => setActiveQuiz(null)}
                            />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
