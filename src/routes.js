import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { csvParser } from "./middlewares/csv-parser.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (_, res) => {

      const tasks = database.select(
        "tasks"
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      try {
        const {id} = req.params;
        const tasks = database.selectById(
          "tasks",
          id
        )
  
        return res.end(JSON.stringify(tasks));
      } catch (e) {
          console.log(e);
          return res.writeHead(400, "id invalido").end();
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      try{
        const { title, description } = req.body;
        
        const taks = {
          id: randomUUID(),
          title,
          description,
          created_at: new Date(),
        };
  
        database.insert("tasks", taks);
  
        return res.writeHead(201).end();
      } catch (e) {
          console.log(e);
          return res.writeHead(403, "Campos de titulo e descricao sao obrigatorios").end();
      }
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks/csv"),
    handler: (req, res) => {
      try{
        csvParser()
  
        return res.writeHead(201).end("Success");
      } catch (e) {
        console.log(e);
        return res.writeHead(400)
      }
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      try{
        const { id } = req.params;
  
        const data = database.selectById("tasks", id)
  
        const { title, description } = req.body;
  
        database.update("tasks", id, {
          ...data,
          updated_at: new Date(),
          title: title ?? data.title,
          description: description ?? data.title
        });
  
        return res.writeHead(204).end();
      }
      catch (e) {
        console.log(e);
          return res.writeHead(400, "id invalido").end();
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      try{
        const { id } = req.params;
  
        const data = database.selectById("tasks", id)
  
        database.update("tasks", id, {
          ...data,
          completed_at: new Date()
        });
  
        return res.writeHead(204).end();
      } catch (e) {
          console.log(e);
          return res.writeHead(400, "id invalido").end();
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      try{
        const { id } = req.params;
  
        database.delete("tasks", id);
  
        return res.writeHead(204).end();
      } catch (e) {
          console.log(e);
          return res.writeHead(400, "id invalido").end();
      }
    },
  },
];
