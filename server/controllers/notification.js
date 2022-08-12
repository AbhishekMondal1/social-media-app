const Notification = require('../models/notification');

// get all notifications
const getAllNotifications = async (req, res) => {
  const perPage = 10;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const pageLimit = page * perPage;
  const skipLimit = perPage * (page - 1);

  try {
    const totalNotifications = await Notification.aggregate([
      {
        $match: { receiverId: req.user._id },
      },
      {
        $count: 'total',
      },
    ]);
    const totalPages = Math.ceil(totalNotifications[0].total / perPage);
    const hasMorePages = page < totalPages;
    const notifications = await Notification.aggregate([
      {
        $match: {
          receiverId: req.user._id,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: pageLimit,
      },
      {
        $skip: skipLimit,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'link',
          foreignField: '_id',
          as: 'post',
        },
      },
      {
        $unwind: {
          path: '$sender',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $set: {
          following: {
            $cond: {
              if: {
                $eq: ['$notificationType', 'follow'],
              },
              then: {
                $in: ['$receiverId', '$sender.followers'],
              },
              else: '$$REMOVE',
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          'sender._id': 1,
          'sender.username': 1,
          'sender.pic': 1,
          notificationType: 1,
          notificationText: 1,
          'post._id': 1,
          'post.photo': 1,
          following: 1,
          read: 1,
          link: 1,
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({ notifications, hasMorePages });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getAllNotifications,
};
