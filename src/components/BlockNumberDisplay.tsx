import { useFetchBlockNumber } from '../hooks/useFetchBlockNumber'; // Import the custom hook to fetch the block number

// This component is responsible for displaying the current block number.
const BlockNumberDisplay = () => {
  // We call `useFetchBlockNumber`, a custom hook, to get the current block number, loading state, and error.
  const { blockNumber, loading, error } = useFetchBlockNumber();

  return (
    <div className="block-info">
      {/* If we're still fetching the block number, show a loading message */}
      {loading && <p className="loading-message">⏳ Loading block number...</p>}

      {/* If there's an error, display the error message */}
      {error && <p className="error-message">⚠️ {error}</p>}

      {/* If the block number has been fetched and there are no errors, display the block number */}
      {!loading && !error && blockNumber && (
        <>
          <p className="block-label">Latest Block Number:</p>
          <p className="block-number">{blockNumber}</p>
        </>
      )}
    </div>
  );
};

export default BlockNumberDisplay; // Export the component so it can be used in other parts of the app
