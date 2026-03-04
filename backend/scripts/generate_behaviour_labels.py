import pandas as pd
import numpy as np

# Load your final feature dataset
df = pd.read_csv("../data/transport_dataset_final_feature.csv")

# -----------------------------
# Risk Point Calculation
# -----------------------------

df["risk_points"] = (
    df["overspeed_flag"] * 3 +
    df["harsh_brake_flag"] * 4 +
    df["sudden_acc_flag"] * 2 +
    df["rash_turn_flag"] * 3 +
    (df["rolling_speed_std"] > 10).astype(int) * 2 +
    (df["rolling_jerk_max"] > 5).astype(int) * 2
)

# -----------------------------
# Behaviour Class Assignment
# -----------------------------

def classify_behaviour(points):
    if points <= 3:
        return "SAFE"
    elif points <= 7:
        return "MODERATE"
    else:
        return "AGGRESSIVE"

df["behaviour_class"] = df["risk_points"].apply(classify_behaviour)

# -----------------------------
# Risk Score (0–100 scale)
# -----------------------------

max_points = df["risk_points"].max()
df["risk_score"] = (df["risk_points"] / max_points) * 100

df.to_csv("../data/transport_dataset_with_behaviour.csv", index=False)

print("Behaviour labels generated.")