export default function ErrorMessage({ message, onRetry }) {
  return (
    <section className="error-panel" role="alert">
      <div><strong>Weather unavailable</strong><p>{message}</p></div>
      <button className="outline-button" type="button" onClick={onRetry}>Try again</button>
    </section>
  );
}
