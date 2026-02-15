import AppRouter from './app/router/AppRouter';
import ErrorBoundary from './components/error/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}

export default App;
