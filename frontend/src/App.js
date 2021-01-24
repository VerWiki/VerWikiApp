import React from "react";
import "./App.css";
import "./grid.css";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { ExplorePage } from "./pages/ExplorePage/ExplorePage";
import { CoursePage } from "./pages/CoursePage/CoursePage";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <ExplorePage />
          </Route>
          <Route path="/courses/:courseId">
            <CoursePage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
