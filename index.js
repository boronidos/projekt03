import express from "express";
import saves from "./models/saves.js";

const port = 8000;

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.use(express.static("public"));

app.get("/saves/", (req, res) => {
  res.render("saves", {
    title: "Load Save",
    saves: saves.getSaveSummaries(),
  });
});

app.get("/new_save/", (req, res) => {
  res.render("new_save", {
    title: "Create New Save",
  });
});

app.get("/saves/:id/", (req, res) => {
  const saveId = req.params.id;
  const save = saves.getSave(saveId);
  if (!save) {
    return res.status(404).render("save", { id: saveId, save: null, title: "save not found" });
  }
  res.render("save", { id: saveId, save: save, title: `save ${saveId}` });
});

function handleNewSave(req, res) {
  const save_id = req.body.name;
  if (!save_id) return res.sendStatus(400);

  if (saves.hasSave(save_id)) {
    return res.sendStatus(409);
  }

  saves.addSave(save_id, { difficulty: req.body.difficulty, progress: req.body.progress });

  res.redirect("/saves/");
}

app.post(["/saves/new", "/saves/new/"], handleNewSave);

// Edit form
app.get("/saves/:id/edit", (req, res) => {
  const id = req.params.id;
  const save = saves.getSave(id);
  res.render("edit_save", { id, save, title: `Edit ${id}` });
});

app.post("/saves/:id/edit", (req, res) => {
  const id = req.params.id;
  if (!saves.hasSave(id)) return res.sendStatus(404);
  const name = req.body.name;
  const difficulty = req.body.difficulty;
  const progress = req.body.progress;
  saves.updateSave(id, { name, difficulty, progress });
  res.redirect(`/saves/${encodeURIComponent(id)}/`);
});

// Delete
app.post("/saves/:id/delete", (req, res) => {
  const id = req.params.id;
  if (!saves.hasSave(id)) return res.sendStatus(404);
  saves.deleteSave(id);
  res.redirect("/saves/");
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});