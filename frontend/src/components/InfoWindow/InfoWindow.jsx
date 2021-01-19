/**
 * The react component for the information window for each node
 * in the concept tree.
 */

// handle right clicks with
// https://stackoverflow.com/questions/31110184/react-synthetic-event-distinguish-left-and-right-click-events

import React from "react";

export default class InfoWindow extends React.Component {
  render() {
    return (
      <div id="info-container">
        <h3>Information Here!</h3>
      </div>
    );
  }
}
