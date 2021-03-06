const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename); // see if the user file exists
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async create(attrs) {
    attrs.id = this.randomID();

    console.log(attrs);

    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);
    return attrs;
  }

  async getAll() {
    // open the user file, read it's contents, parse the contents, return the data
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  async writeAll(records) {
    // write the updated records array to users.json
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2) // '2' designates the level of indentation to use inside the string
    );
  }

  randomID() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    // did we find a record?
    if (!record) {
      throw new Error(`Record with id of ${id} not found`);
    }
    Object.assign(record, attrs); // copies key/value pairs from attrs to record object
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      let found = true;
      for (let key in filters) {
        // loop through filters object
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
};
