import { ChainProvider } from './api/ChainProvider'; // Import the ChainProvider to manage the API context
import './App.css'; // Import styles for the app
import BlockNumberDisplay from './components/BlockNumberDisplay'; // Import the BlockNumberDisplay component

// The main application component
const App = () => {
  return (
    // Wrap the entire app in ChainProvider, which initializes the API and provides it to the child components
    <ChainProvider>
      <div className="app-container">
        <header>
          <h1 className="header-title">DEMO PAPI DAPP</h1> {/* App title */}
        </header>

        <div className="content">
          {/* Component responsible for fetching and displaying the latest block number */}
          <BlockNumberDisplay />
        </div>

        <footer className="footer">
          <p>© 2024 papi template</p> {/* Footer with copyright information */}
        </footer>
      </div>
    </ChainProvider>
  );
};

export default App; // Export the App component so it can be rendered in the DOM
