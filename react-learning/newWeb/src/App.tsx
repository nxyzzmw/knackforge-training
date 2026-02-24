import { Suspense, lazy } from "react";

const LazyComponent1 = lazy(() => import("./component1"));

const App = () => {
  return (
    <div>
      <Suspense fallback={<p>Loading feature module...</p>}>
        <LazyComponent1 pageTitle="Zustand Auth + Performance Hooks" />
      </Suspense>
    </div>
  );
};

export default App;
