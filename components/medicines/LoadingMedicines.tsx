export function LoadingMedicines() {
  return (
    <div className="medicines-page">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading medicines...</p>
      </div>
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1rem;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        p {
          color: #64748b;
          font-size: 0.9rem;
        }
        :global(.dark) .spinner {
          border-color: #374151;
          border-top-color: #3b82f6;
        }
        :global(.dark) p {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
