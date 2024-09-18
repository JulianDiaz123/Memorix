import { SimonGame } from "./components/Simon_game";
import "./App.css";

function App() {
  return (
    <>
      <div className="title">
        <h1>Simon Says</h1>
      </div>
      <SimonGame />
    </>
  );
}

export default App;
