const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
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
}

module.exports = new UsersRepository("users.json");
