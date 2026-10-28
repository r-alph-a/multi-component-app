export default function StatusMessage({ status, message }) {
  return <div className={`status status--${status}`} role="status" aria-live="polite"><span aria-hidden="true" />{message}</div>;
}
