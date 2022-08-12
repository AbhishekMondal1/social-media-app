const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('@admin-bro/mongoose');

const User = require('../models/user');
const { post } = require('../models/post');

AdminBro.registerAdapter(AdminBroMongoose);

/** @type {import('admin-bro').AdminBroOptions} */
const options = {
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
      resource: post,
      options: {
        properties: {},
      },
    },
  ],
};

module.exports = options;
