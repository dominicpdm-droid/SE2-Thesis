import AppRoutes from "../routes/AppRoutes.jsx";
import { ActivityProvider } from "../context/activityContext.jsx";
import { DeviceStateProvider } from "../context/deviceStateContext.jsx";

function App() {
  return (
    <DeviceStateProvider>
      <ActivityProvider>
        <AppRoutes />
      </ActivityProvider>
    </DeviceStateProvider>
  );
}

export default App;
