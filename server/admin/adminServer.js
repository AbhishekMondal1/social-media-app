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
          properties: {},
        },
      },
    ],
    rootPath: "/admin",
    branding: {
      companyName: "Connect ALL",
      theme: {
        colors: {
          primary100: "#ff5733",
          primary80: '#f638dc',
          primary60: '#9a0f98',
          primary40: '#ff0000',
          primary20: '#ff0000',
          accent: "#45056e",
          white: "#160f30",
          grey100: "#fff",
          grey80: "#fff",
          grey60: '#fff',
          grey40: '#fff',
          grey20: '#7045af',
          bg: "#2b3595",
          hoverBg: "#fd7014",
          info: "#881122",
          filterBg: '#892cdc',
        },
        font: "rubik,arial"
      },
    },
    dashboard: {
      component: AdminBro.bundle("./my-dashboard"),
    },
  });
  const router = buildAdminRouter(admin);
  app.use(admin.options.rootPath, router);
  app.listen(port, () =>
    console.log(`Admin app listening at http://localhost:${port}`)
  );
};


module.exports = run;
