import db from "./db.js";

function rowToSave(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || row.id,
    data: [
      { difficulty: row.difficulty || "" },
      { progress: row.progress || "" },
    ],
  };
}

export function getSaveSummaries() {
  const rows = db.getAllData("SELECT id, name, difficulty, progress FROM saves");
  return rows.map(rowToSave);
}

export function hasSave(saveId) {
  const row = db.getData("SELECT id FROM saves WHERE id = ?", [saveId]);
  return !!row;
}

export function getSave(saveId) {
  const row = db.getData("SELECT * FROM saves WHERE id = ?", [saveId]);
  return rowToSave(row);
}

export function addSave(saveId, data) {
  const existing = db.getData("SELECT id FROM saves WHERE id = ?", [saveId]);
  const name = saveId;
  const difficulty = data.difficulty || "";
  const progress = data.progress || "";
  const now = new Date().toISOString();

  if (!existing) {
    db.runData(
      "INSERT INTO saves (name, difficulty, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [name, difficulty, progress, now, now]
    );
  } else {
    db.runData(
      "UPDATE saves SET difficulty = ?, progress = ?, updated_at = ? WHERE name = ?",
      [difficulty, progress, now, name]
    );
  }
}

export function updateSave(saveId, data) {
  const difficulty = data.difficulty || "";
  const progress = data.progress || "";
  const name = data.name || "";
  const now = new Date().toISOString();
  db.runData(
    "UPDATE saves SET name = ?, difficulty = ?, progress = ?, updated_at = ? WHERE id = ?",
    [name, difficulty, progress, now, saveId]
  );
}

export function deleteSave(saveId) {
  db.runData("DELETE FROM saves WHERE id = ?", [saveId]);
}

export default {
  getSaveSummaries,
  hasSave,
  getSave,
  addSave,
  updateSave,
  deleteSave,
};