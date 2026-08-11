import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center gap-3 p-6 bg-background text-foreground text-center">
          <p className="font-display font-semibold text-lg">Something went wrong</p>
          <p className="text-sm text-muted-foreground max-w-sm">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-sm text-primary underline mt-2"
          >
            Reload app
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
