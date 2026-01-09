import random
import csv
import math

# =========================
# USER INPUT
# =========================
TOTAL_ROWS = int(input("Enter total number of rows: "))
TRAIN_RATIO = float(input("Enter train split ratio (e.g. 0.8): "))

assert 0 < TRAIN_RATIO < 1, "Train ratio must be between 0 and 1"

TRAIN_ROWS = int(TOTAL_ROWS * TRAIN_RATIO)
TEST_ROWS = TOTAL_ROWS - TRAIN_ROWS

print(f"Generating {TRAIN_ROWS} train rows and {TEST_ROWS} test rows...\n")

# =========================
# CONFIG
# =========================
SEED = 42
random.seed(SEED)

TRAIN_FILE = "pcos_train.csv"
TEST_FILE = "pcos_test.csv"

# =========================
# HELPERS
# =========================
def weighted_choice(options):
    values, weights = zip(*options)
    return random.choices(values, weights=weights, k=1)[0]

def clamp(v, lo, hi):
    return max(lo, min(hi, v))

def generate_row():
    # ---------- AGE ----------
    age = weighted_choice([
        (random.randint(16, 17), 1),
        (random.randint(18, 35), 6),
        (random.randint(36, 45), 2),
    ])

    # ---------- HEIGHT ----------
    height_cm = random.randint(140, 190)

    # ---------- FEATURES ----------
    cycle_regularity = weighted_choice([
        ("regular", 6),
        ("irregular", 3),
        ("absent", 1),
    ])

    symptom_acne = random.randint(0, 1)
    symptom_hair_growth = random.randint(0, 1)
    symptom_hair_loss = random.randint(0, 1)
    family_history = random.randint(0, 1)

    exercise_frequency = weighted_choice([
        ("sedentary", 3),
        ("moderate", 4),
        ("active", 3),
    ])

    sleep_quality = weighted_choice([
        ("good", 4),
        ("fair", 4),
        ("poor", 2),
    ])

    # ---------- PCOS PROB ----------
    p = 0.07

    if cycle_regularity != "regular":
        p += 0.15
    if symptom_hair_growth:
        p += 0.12
    if symptom_acne:
        p += 0.08
    if family_history:
        p += 0.10
    if exercise_frequency == "sedentary":
        p += 0.05
    if sleep_quality == "poor":
        p += 0.05

    p = clamp(p, 0.01, 0.85)
    pcos_label = 1 if random.random() < p else 0

    # ---------- BMI ----------
    if pcos_label:
        bmi = random.gauss(29, 5)
    else:
        bmi = random.gauss(23, 4)

    bmi = round(clamp(bmi, 16.0, 45.0), 1)

    # ---------- WEIGHT ----------
    weight_kg = int(round(bmi * (height_cm / 100) ** 2))

    # ---------- LABEL NOISE ----------
    if random.random() < 0.07:
        pcos_label = 1 - pcos_label

    return [
        age, height_cm, weight_kg, bmi,
        cycle_regularity,
        symptom_acne, symptom_hair_growth, symptom_hair_loss,
        family_history,
        exercise_frequency, sleep_quality,
        pcos_label, "synthetic_v1"
    ]

# =========================
# CSV WRITING
# =========================
HEADER = [
    "age","height_cm","weight_kg","bmi","cycle_regularity",
    "symptom_acne","symptom_hair_growth","symptom_hair_loss",
    "family_history","exercise_frequency","sleep_quality",
    "pcos_label","label_source"
]

with open(TRAIN_FILE, "w", newline="") as train_f, open(TEST_FILE, "w", newline="") as test_f:
    train_writer = csv.writer(train_f)
    test_writer = csv.writer(test_f)

    train_writer.writerow(HEADER)
    test_writer.writerow(HEADER)

    for i in range(TOTAL_ROWS):
        row = generate_row()

        if i < TRAIN_ROWS:
            train_writer.writerow(row)
        else:
            test_writer.writerow(row)

print("✅ Done.")
print(f"Train file: {TRAIN_FILE}")
print(f"Test file : {TEST_FILE}")
