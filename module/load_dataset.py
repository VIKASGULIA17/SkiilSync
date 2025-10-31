import pandas as pd

# Load skill database and extract relevant keywords
def load_skill_database(csv_path, role):
    df = pd.read_csv(csv_path)
    df['Role'] = df['Role'].str.lower()
    role = role.lower()

    filtered_df = df[df['Role'] == role]
    if filtered_df.empty:
        print(f"🚫 No entries found for role: '{role}'.")
        return set()

    keywords_series = pd.concat([
        filtered_df["ATS Keywords"].str.split(","),
        filtered_df["Skills"].str.split(",")
    ]).explode().str.strip().dropna()
    
    return set(keywords_series)