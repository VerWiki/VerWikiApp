/**
 * The react component for the information window for each node
 * in the concept tree.
 */

// handle right clicks with
// https://stackoverflow.com/questions/31110184/react-synthetic-event-distinguish-left-and-right-click-events

import React from "react";

export const InfoWindow = ({ info }) => {
  return (
    <div>
      <h2>Wiki Information</h2>
      <p>{info}</p>
    </div>
  );
};
