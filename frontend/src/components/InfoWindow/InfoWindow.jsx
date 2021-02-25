/**
 * The react component for the information window for each node
 * in the concept tree.
 */

import React from "react";

export const InfoWindow = ({ info }) => {
  return (
    <div>
      <h2>Wiki Information</h2>
      <p>{info}</p>
    </div>
  );
};
