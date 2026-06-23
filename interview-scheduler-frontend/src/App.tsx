import { Toaster } from 'react-hot-toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WelcomePage } from './components/WelcomePage';
import { DashboardPage } from './components/DashboardPage';

function App() {
  const [recruiterName, setRecruiterName] = useLocalStorage<string | null>('recruiter_name', null);

  if (!recruiterName) {
    return (
      <>
        <Toaster position="top-right" />
        <WelcomePage onNameSubmit={setRecruiterName} />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <DashboardPage
        recruiterName={recruiterName}
        onLogout={() => setRecruiterName(null)}
      />
    </>
  );
}

export default App;
