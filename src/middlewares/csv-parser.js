import { parse } from 'csv-parse';
import fs from "fs";

export const csvParser = () =>
fs.createReadStream("./src/csv-file.csv").
    pipe(parse({delimiter: ",", from_line: 2}))
    .on("data", (row) => {
        const data = {title: row[0], description: row[1]}
        
        fetch("http://localhost:3335/tasks", {
            method: "POST",
            body: JSON.stringify(data)
        }) 
    });