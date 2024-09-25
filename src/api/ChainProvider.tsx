import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { paseo } from '@polkadot-api/descriptors'; // Import chain descriptors for the Polkadot API
import { createClient, TypedApi } from 'polkadot-api'; // Function to create a Polkadot API client
import { getSmProvider } from 'polkadot-api/sm-provider'; // Provider for interacting with the chain using Smoldot
import { chainSpec as paseoChainSpec } from 'polkadot-api/chains/paseo'; // Chain specification for the relay chain (Paseo)
import { chainSpec as paseoAhChainSpec } from 'polkadot-api/chains/paseo_asset_hub'; // Chain spec for the asset hub parachain
import { startFromWorker } from 'polkadot-api/smoldot/from-worker'; // Helper to start Smoldot from a WebWorker
import SmWorker from 'polkadot-api/smoldot/worker?worker'; // Smoldot WebWorker to manage connections in the background

type PaseoApi = TypedApi<typeof paseo>;

// TypeScript interface for the context that will be shared across the app
// This defines the shape of the state that will be available to all components.
interface ChainContextType {
  api: PaseoApi | null; // The API object from Polkadot that will be used to interact with the blockchain. It's `null` initially.
  loading: boolean; // Boolean to indicate if the API is still being initialized (loading state).
  error: string | null; // Holds any error message that occurs during API initialization, `null` if no error.
}

// This creates a context object. A context is a way to pass data through the component tree
// without having to pass props down manually at every level.
// Here, we're setting up a ChainContext that will provide API, loading, and error states.
const ChainContext = createContext<ChainContextType>({
  api: null, // Initially, the API is null because it's not yet initialized.
  loading: false, // Initially, we are not loading anything.
  error: null, // No errors initially.
});

// This is the ChainProvider component. It wraps around other components and provides the API context to them.
// This context will allow any child components to access the API once it's initialized.
export const ChainProvider = ({ children }: { children: ReactNode }) => {
  // `useState` is a React hook that lets us add state to a functional component.
  // We use it to keep track of the API instance, the loading state, and any errors during initialization.
  const [api, setApi] = useState<PaseoApi | null>(null); // Holds the Polkadot API instance.
  const [loading, setLoading] = useState<boolean>(true); // Boolean to track whether the API is still initializing.
  const [error, setError] = useState<string | null>(null); // String to hold any error that occurs during initialization.

  // `useEffect` is another React hook. It allows us to run side effects in function components.
  // This effect runs once when the component is mounted (because we pass an empty array `[]` as the second argument),
  // and it initializes the Polkadot API.
  useEffect(() => {
    const initApi = async () => {
      try {
        // Log that we're starting the Smoldot worker and the API initialization.
        console.log('Initializing Smoldot worker and API connection...');

        // Create a new Smoldot worker, which manages the blockchain connection in a separate thread.
        const worker = new SmWorker();
        const smoldot = startFromWorker(worker); // Start the worker using Smoldot.

        // Add the relay chain (Paseo) to Smoldot. The relay chain is the main Polkadot blockchain that the parachains connect to.
        const relayChain = await smoldot.addChain({
          chainSpec: paseoChainSpec,
        });
        console.log('Connected to the relay chain');

        // Add the parachain (asset hub) to Smoldot, using the relay chain we just connected to.
        const assetHubChain = await smoldot.addChain({
          chainSpec: paseoAhChainSpec, // The asset hub parachain spec.
          potentialRelayChains: [relayChain], // We tell the parachain that it relies on the relay chain.
        });
        console.log('Connected to asset hub chain');

        // Create a Polkadot API client using Smoldot as the provider.
        // This API instance will be used to interact with the blockchain (e.g., fetch block numbers).
        const client = createClient(getSmProvider(assetHubChain));
        const apiInstance = client.getTypedApi(paseo); // Get a typed version of the API for specific queries.

        // Store the API instance in state so that other components can access it.
        setApi(apiInstance);
        console.log('API instance created and set');
      } catch (err) {
        // If any error occurs during initialization, catch it and store the error message.
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to connect to the chain: ${errorMsg}`);
        console.error('Error initializing the API:', errorMsg); // Log the error to the console for debugging.
      } finally {
        // Once the API has been initialized (or failed), we stop showing the loading state.
        console.log('API initialization complete');
        setLoading(false);
      }
    };

    // Call the async function to initialize the API
    initApi();
  }, []); // The empty array means this effect will only run once when the component mounts.

  // The `ChainProvider` component returns a `Provider` component from the context we created earlier.
  // This makes the API, loading, and error states available to any child components that use the `useApi` hook.
  return (
    <ChainContext.Provider value={{ api, loading, error }}>
      {children}
      {/* `children` are the components that are wrapped by ChainProvider, like BlockNumberDisplay. */}
    </ChainContext.Provider>
  );
};

// Custom hook that allows other components to access the chain API context.
// By calling `useApi`, components can access the API instance, loading state, and any error message.
export const useApi = () => {
  const context = useContext(ChainContext); // `useContext` retrieves the current value of the ChainContext.

  // If a component tries to use `useApi` without being wrapped by a `ChainProvider`,
  // we throw an error to prevent unexpected behavior.
  if (!context) {
    throw new Error('useApi must be used within a ChainProvider');
  }

  // Return the context value, which includes the API, loading, and error states.
  return context;
};
