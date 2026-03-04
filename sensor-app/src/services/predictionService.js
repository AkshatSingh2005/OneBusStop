const API_URL = "http://10.0.2.2:8000/predict";

export async function predictDriver(sensorData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sensorData)
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Prediction error:", error);
    return null;
  }
}