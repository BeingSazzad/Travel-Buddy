import React from "react";

/** Catches render crashes so the app never dies on a blank white screen. */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[Seluna] UI crash:", error, info?.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center gap-3 p-6 bg-background text-foreground text-center">
          <p className="font-display font-semibold text-lg">Something went wrong</p>
          <p className="text-sm text-muted-foreground max-w-sm break-words">
            {this.state.error?.message || "Unexpected error"}
          </p>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="text-sm text-primary underline"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ error: null });
                window.location.assign("/");
              }}
              className="text-sm text-muted-foreground underline"
            >
              Go home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
