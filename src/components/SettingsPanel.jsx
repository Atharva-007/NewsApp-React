const SettingsPanel = ({
    open,
    onClose,
    darkMode,
    onToggleDark,
    compactMode,
    onToggleCompact,
    glassMode,
    onToggleGlass,
    reduceMotion,
    onToggleReduceMotion,
    viewMode,
    onChangeView
}) => {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl shadow-2xl border bg-white/80 dark:bg-gray-900/80 border-black/10 dark:border-white/10 backdrop-blur-xl">
                <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Quick Settings</h3>
                    <button aria-label="Close settings" onClick={onClose} className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10">✕</button>
                </div>
                <div className="p-5 space-y-4">
                    <label className="flex items-center justify-between gap-3">
                        <span>Dark Mode</span>
                        <input type="checkbox" checked={darkMode} onChange={onToggleDark} className="h-5 w-5" />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                        <span>Compact Density</span>
                        <input type="checkbox" checked={compactMode} onChange={onToggleCompact} className="h-5 w-5" />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                        <span>Glassy Surfaces</span>
                        <input type="checkbox" checked={glassMode} onChange={onToggleGlass} className="h-5 w-5" />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                        <span>Reduce Motion</span>
                        <input type="checkbox" checked={reduceMotion} onChange={onToggleReduceMotion} className="h-5 w-5" />
                    </label>
                    <div className="flex items-center justify-between gap-3">
                        <span>Layout</span>
                        <div className="flex rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
                            <button aria-label="List view" onClick={() => onChangeView('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary text-white' : ''}`}>☰</button>
                            <button aria-label="Grid view" onClick={() => onChangeView('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary text-white' : ''}`}>☷</button>
                        </div>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 pt-2">
                        Shortcuts: / focus search • D toggle dark • Esc close modals
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPanel
