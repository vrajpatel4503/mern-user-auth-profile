import { ToastContainer } from "react-toastify";
import AppRouter from "./AppRoutes.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}

export default App;
