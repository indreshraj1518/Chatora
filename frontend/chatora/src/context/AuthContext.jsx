import { useEffect } from "react";
import socket from "./utils/socket"; // path adjust karo

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?._id || user?.id) {
      const userId = user._id || user.id;

      // 🔗 join room
      socket.emit("join", userId);
    }
  }, []);

  return (
    <div>
      {/* your app */}
    </div>
  );
}

export default App;