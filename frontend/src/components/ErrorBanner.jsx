export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <span className="error-message">{message}</span>
      <button
        className="error-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        Dismiss
      </button>
    </div>
  );
}
