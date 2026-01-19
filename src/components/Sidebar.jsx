import React, { useState, useEffect } from 'react';
import { Settings, X, Save, Key, Globe, Box } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, onClose, config, onSave }) => {
    const [localConfig, setLocalConfig] = useState(config);

    // Sync local state when config prop changes
    useEffect(() => {
        setLocalConfig(config);
    }, [config]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalConfig((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(localConfig);
        // Optional: show toast or feedback
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Panel */}
            <aside
                className={clsx(
                    "fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out transform border-r border-slate-100",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Settings className="w-6 h-6 text-blue-600" />
                            Settings
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6 flex-1">
                        {/* API Base URL */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-500" />
                                API Base URL
                            </label>
                            <input
                                type="text"
                                name="baseUrl"
                                value={localConfig.baseUrl}
                                onChange={handleChange}
                                placeholder="https://api.openai.com/v1"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-xs text-slate-600"
                            />
                            <p className="text-xs text-slate-400">Default endpoint for your LLM provider.</p>
                        </div>

                        {/* API Key */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Key className="w-4 h-4 text-amber-500" />
                                API Key
                            </label>
                            <input
                                type="password"
                                name="apiKey"
                                value={localConfig.apiKey}
                                onChange={handleChange}
                                placeholder="sk-..."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-xs text-slate-600"
                            />
                        </div>

                        {/* Model Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Box className="w-4 h-4 text-purple-500" />
                                Model Name
                            </label>
                            <input
                                type="text"
                                name="modelName"
                                value={localConfig.modelName}
                                onChange={handleChange}
                                placeholder="gpt-4o, gemini-1.5-flash"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono text-xs text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-6 border-t border-slate-100">
                        <button
                            onClick={handleSave}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Configuration
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
