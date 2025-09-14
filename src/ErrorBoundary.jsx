import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        // Also reload to reset any bad state
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <div className="max-w-lg w-full rounded-2xl border border-black/10 dark:border-white/10 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl">
                        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                        <p className="text-sm opacity-80 mb-4">An unexpected error occurred. You can try reloading the page.</p>
                        <pre className="text-xs overflow-auto p-3 rounded bg-black/5 dark:bg-white/10 mb-4 max-h-40">
                            {String(this.state.error)}
                        </pre>
                        <button onClick={this.handleReset} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Reload</button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
