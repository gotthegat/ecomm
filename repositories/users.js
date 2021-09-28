const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
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

  async getAll() {
    // open the user file, read it's contents, parse the contents, return the data
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  async create(attrs) {
    // attrs = { email: '', password: ''}
    //tack on a random ID
    attrs.id = this.randomID();

    const salt = crypto.randomBytes(8).toString("hex"); // create salt
    const buffer = await scrypt(attrs.password, salt, 64); // create hashed password

    const records = await this.getAll(); // get latest collection of users
    // add new user, tack salt onto hashed password
    const record = {
      ...attrs, // take properties out of attrs object
      password: `${buffer.toString("hex")}.${salt}`, // overwrite plain text password
    };
    records.push(record);
    await this.writeAll(records);
    return record;
  }

  async comparePasswords(saved, supplied) {
    // saved -> password saved in our database
    // supplied -> password used to sign in
    const [hashed, salt] = saved.split("."); // destructure results of split
    const hashedSuppliedBuffer = await scrypt(supplied, salt, 64);
    return hashed === hashedSuppliedBuffer.toString("hex");
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
}

module.exports = new UsersRepository("users.json");
