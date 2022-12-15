const BASE_URL = "http://localhost:4000";

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${BASE_URL}/planets`);
  return await response.json();
}
// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${BASE_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}
// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    const response = fetch(`${BASE_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
    return response;
  } catch (error) {
    return { ok: false };
  }
}
// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    const response = fetch(`${BASE_URL}/launches/${id}`, {
      method: "delete",
    });
    return response;
  } catch (error) {
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
