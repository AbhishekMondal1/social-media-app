const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('@admin-bro/mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

const User  = require('../models/user');
const { post } = require('../models/post');
const { comment } = require('../models/comment');

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
