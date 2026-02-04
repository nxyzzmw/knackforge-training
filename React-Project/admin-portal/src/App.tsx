import AppProvider from './context/AppProvider';
import AppRoutes from './routes/AppRoutes';
const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}

export default App