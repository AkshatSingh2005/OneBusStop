import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    ConfusionMatrixDisplay
)

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC


# Load dataset
df = pd.read_csv("../data/transport_dataset_final_feature.csv")

target = "bus_number"

# Drop useless columns
drop_cols = [
    "id", "title", "description",
    "Accelerometer_Day",
    "AccelerometerUncalibrated_Day",
    "Gyroscope_Day",
    "GyroscopeUncalibrated_Day",
    "Location_Day",
    "TotalAcceleration_Day"
]
df = df.drop(columns=[col for col in drop_cols if col in df.columns])

# Split X, y
X = df.drop(columns=[target])
y = df[target]

# 🔥 Step 1: Convert categorical → numeric
X = pd.get_dummies(X)

# 🔥 Step 2: Handle NaN PROPERLY
X = X.replace([float("inf"), -float("inf")], 0)  # remove infinity
X = X.fillna(0)  # fill NaN

# 🔥 Step 3: Encode target
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
y = le.fit_transform(y)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Models
models = {
    "Logistic": LogisticRegression(max_iter=1000),
    "KNN": KNeighborsClassifier(n_neighbors=5),
    "SVM": SVC(),
    "RandomForest": RandomForestClassifier(n_estimators=100)
}

results = []

print("\nMODEL EVALUATION\n")

for name, model in models.items():
    print(f"\n--- {name} ---")

    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    acc = accuracy_score(y_test, preds)
    prec = precision_score(y_test, preds, average='weighted', zero_division=0)
    rec = recall_score(y_test, preds, average='weighted')
    f1 = f1_score(y_test, preds, average='weighted')

    print(f"Accuracy: {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall: {rec:.4f}")
    print(f"F1 Score: {f1:.4f}")

    results.append({
        "model": name,
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1": f1
    })

    # Confusion Matrix (only for RandomForest to save time)
    if name == "RandomForest":
        cm = confusion_matrix(y_test, preds)
        disp = ConfusionMatrixDisplay(cm)
        disp.plot()
        plt.title("RandomForest Confusion Matrix")
        plt.show()


# Convert results to DataFrame
results_df = pd.DataFrame(results)

# -------- GRAPH 1: Accuracy Comparison --------
plt.figure()
plt.bar(results_df["model"], results_df["accuracy"])
plt.title("Model Accuracy Comparison")
plt.xlabel("Model")
plt.ylabel("Accuracy")
plt.show()

# -------- GRAPH 2: F1 Score --------
plt.figure()
plt.bar(results_df["model"], results_df["f1"])
plt.title("Model F1 Score Comparison")
plt.xlabel("Model")
plt.ylabel("F1 Score")
plt.show()

# -------- GRAPH 3: Precision vs Recall --------
plt.figure()
plt.plot(results_df["model"], results_df["precision"], label="Precision", marker='o')
plt.plot(results_df["model"], results_df["recall"], label="Recall", marker='o')
plt.title("Precision vs Recall")
plt.legend()
plt.show()

# Ranking
results_df = results_df.sort_values(by="accuracy", ascending=False)

print("\nFINAL MODEL RANKING:\n")
print(results_df)