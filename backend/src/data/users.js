const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    name: "Angel",
    email: "angel@gmail.com",
    passwordHash: bcrypt.hashSync("123456", 10)
  },
  {
    id: 2,
    name: "Luisa",
    email: "luisa@gmail.com",
    passwordHash: bcrypt.hashSync("123456", 10)
  },
  {
    id: 3,
    name: "Carlos",
    email: "carlos@gmail.com",
    passwordHash: bcrypt.hashSync("123456", 10)
  },
  {
    id: 4,
    name: "Maria",
    email: "maria@gmail.com",
    passwordHash: bcrypt.hashSync("123456", 10)
  },
  {
    id: 5,
    name: "Admin",
    email: "admin@gmail.com",
    passwordHash: bcrypt.hashSync("admin123", 10)
  }
];

module.exports = users;
