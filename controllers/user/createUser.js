const asyncWrapper = require("@middleware/asyncWrapper");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const { PrismaClient: PrismaClientSQL } = require("@prisma/client");
const { BadRequestError } = require("@errors");
const prisma = new PrismaClientSQL();
const logger = require("@middleware/logger");

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{14,}$/;
const saltRounds = 10;

const createUser = asyncWrapper(async (req, res) => {
  const { email, login, password } = req.body;
  if (!email || !login || !password) {
    throw new BadRequestError("All credentials must be provided");
  }

  const findLogin = await prisma.user.findFirst({
    where: { login: login },
  });

  if (findLogin !== null) {
    return res.status(400).json({ msg: "Login is already taken" });
  }

  if (emailRegex.test(email) && passwordRegex.test(password)) {
    const uuid = uuidv4();
    const hashedEmail = await bcrypt.hash(email, saltRounds);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.create({
      data: {
        uuid: uuid,
        email: hashedEmail,
        login: login,
        password: hashedPassword,
        routespace: 1,
        userLevel: 0,
      },
    });

    await prisma.profile.create({
      data: {
        userLogin: login,
        bio: "Standard bio",
        image: "https://test.com/jpg",
      },
    });

    try {
      await fs.mkdir(`userdata/${uuid}`, { recursive: true });
      logger.log({
        level: "info",
        message: `User ${login} created successfully`,
      });
      res.status(201).json({ msg: "User created successfully" });
    } catch (err) {
      logger.log({
        level: "error",
        message: `Error creating user directory for ${login}: ${err.message}`,
      });
      res.status(500).json({ message: "Error creating user directory" });
    }
  } else {
    res.status(400).json({ msg: "Invalid email or password format" });
  }
});

module.exports = {
  createUser,
};
