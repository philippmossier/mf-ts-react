import * as React from 'react';

const App2Button = React.lazy(() => import('app2/Button'));
const App3Button = React.lazy(() => import('app3/Button'));

const App = () => (
  <div>
    <h1>Typescript</h1>
    <h2>App 1</h2>
    <React.Suspense fallback="Loading App2Button...">
      <App2Button />
    </React.Suspense>
    <React.Suspense fallback="Loading App3Button...">
      <App3Button />
    </React.Suspense>
  </div>
);

export default App;
