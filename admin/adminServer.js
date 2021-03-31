const express = require('express');
const { default: AdminBro } = require('admin-bro');
const mongoose = require('mongoose');
const buildAdminRouter = require('./admin.router');
const AdminBroMongoose = require("@admin-bro/mongoose");

AdminBro.registerAdapter(AdminBroMongoose);
const  User = require("../models/user");
const  Post = require("../models/post");
const app = express();
const port = 3001;

const run = async () => {
  const dbmongo = await mongoose.connect('mongodb+srv://abhi:P4ssNewSavedn0w@cluster0.ldotm.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const admin = new AdminBro({
    databases: [dbmongo],
    resources: [
      {
        resource: User,
        options: {
          properties: {
            password: { isVisible: { list: false } },
          },
        },
      },
      {
        resource: Post,
        options: {
          properties: {

          }
        }
      }
    ],
    rootPath: "/admin",
    branding: {
      companyName: "Connect ALL",
      theme: {
        colors: {
          primary100: "#ff0000",
          accent: "#fff",
          filterBg: "#21e6c1",
          bg: "#121212",
          white: "#151515",
          grey100: "#ff5733",
          hoverBg: "#d60a89",
          info: "#881122",
          highlight: "#0055ff",
          infoLight: "#000",
        },
        font: "Cursive",
      },
    },
  });
  const router = buildAdminRouter(admin);
  app.use(admin.options.rootPath, router);
  app.listen(port, () =>
    console.log(`Admin app listening at http://localhost:${port}`)
  );
};


module.exports = run;
