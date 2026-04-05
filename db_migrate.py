"""
Simple ad-hoc DB migration tool for development.
Adds missing columns used by latest models: `ecg_image_path` on clinical_data and
`image_probability`, `combined_probability` on prediction table.
Run: python db_migrate.py
"""
import sqlite3
import os

# The SQLite DB is stored in the Flask "instance" folder
DB_PATH = os.path.join(os.path.dirname(__file__), 'instance', 'cardiac_risk.db')
DB_PATH = os.path.abspath(DB_PATH)

if not os.path.exists(DB_PATH):
    print(f"DB not found at {DB_PATH}. Nothing to migrate.")
    exit(0)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

def column_exists(table, column):
    cur.execute(f"PRAGMA table_info({table});")
    cols = [row[1] for row in cur.fetchall()]
    return column in cols

migrations = []

if not column_exists('clinical_data', 'ecg_image_path'):
    migrations.append(("clinical_data", "ALTER TABLE clinical_data ADD COLUMN ecg_image_path TEXT;"))

if not column_exists('prediction', 'image_probability'):
    migrations.append(("prediction", "ALTER TABLE prediction ADD COLUMN image_probability REAL;"))

if not column_exists('prediction', 'combined_probability'):
    migrations.append(("prediction", "ALTER TABLE prediction ADD COLUMN combined_probability REAL;"))

if not migrations:
    print("No migrations needed. Database is up-to-date.")
else:
    print(f"Applying {len(migrations)} migration(s)...")
    for table, sql in migrations:
        print(f" - Adding column in {table} ...")
        try:
            cur.execute(sql)
            print("   OK")
        except Exception as e:
            print(f"   FAILED: {e}")
    conn.commit()
    print("Migrations applied.")

conn.close()