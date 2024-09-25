import { useEffect, useState } from 'react'; // Import React hooks for state and side effects
import { Subscription } from 'rxjs';
import { useApi } from '../api/ChainProvider'; // Import the custom hook to access the Polkadot API

// Custom hook to fetch and watch for the latest block number.
// Hooks are a way to reuse logic across multiple components in React.
export const useFetchBlockNumber = () => {
  const { api, loading: apiLoading, error: apiError } = useApi(); // Get the API instance and loading/error states from the ChainProvider.

  // Local state to hold the latest block number, loading state, and any errors related to fetching the block number.
  const [blockNumber, setBlockNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // This `useEffect` runs when the component mounts or when the `api`, `apiLoading`, or `apiError` changes.
  useEffect(() => {
    let unsubscribe: Subscription; // We'll use this to unsubscribe from the block number updates when the component unmounts.

    const watchBlockNumber = () => {
      // Only proceed if the API has been successfully initialized.
      if (api) {
        try {
          // Subscribe to the block number updates from the blockchain.
          // 'watchValue' allows us to listen for changes to the block number in real time.
          const observable = api.query.System.Number.watchValue('best');

          // When a new block is produced, update the block number state.
          unsubscribe = observable.subscribe((newBlockNumber: number) => {
            setBlockNumber(newBlockNumber.toString()); // Convert the block number to a string and update the state.
            setLoading(false); // Stop showing the loading state once we receive the first block number.
          });
        } catch (e) {
          // If there's an error during subscription, update the error state and stop the loading state.
          setError(
            e instanceof Error ? e.message : 'Failed to watch block number',
          );
          setLoading(false);
        }
      }
    };

    // If the API is ready and no errors, start watching for the block number.
    if (!apiLoading && !apiError) {
      watchBlockNumber();
    } else if (apiError) {
      // If there was an error during API initialization, set the error message here.
      setError(apiError);
      setLoading(false);
    }

    // Cleanup function: When the component unmounts or the dependencies change,
    // we unsubscribe from the block number updates to avoid memory leaks.
    return () => {
      if (unsubscribe) {
        unsubscribe.unsubscribe();
      }
    };
  }, [api, apiLoading, apiError]); // This effect depends on the API and its loading/error states.

  // Return the block number, loading state, and error state so that the component can display them.
  return { blockNumber, loading, error };
};
