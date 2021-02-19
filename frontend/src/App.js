import React from "react";
import "./App.css";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { ExplorePage } from "./pages/ExplorePage/ExplorePage";
import { CoursePage } from "./pages/CoursePage/CoursePage";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

// Set the color theme for the entire application
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#008796",
    },
    secondary: {
      main: "#960f00",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
