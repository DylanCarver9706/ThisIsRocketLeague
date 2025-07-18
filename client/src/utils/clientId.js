// Generate a unique client ID for tracking user likes
export const getClientId = () => {
  let clientId = localStorage.getItem("rocketLeagueClientId");

  if (!clientId) {
    // Generate a random client ID
    clientId =
      "client_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    localStorage.setItem("rocketLeagueClientId", clientId);
  }

  return clientId;
};

// Clear client ID (for testing purposes)
export const clearClientId = () => {
  localStorage.removeItem("rocketLeagueClientId");
};
