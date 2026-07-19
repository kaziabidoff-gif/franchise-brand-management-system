const asyncHandler = require('../utils/asyncHandler');
const { getPagination, paginationMeta } = require('../utils/pagination');
const notificationModel = require('../models/notification.model');

const listNotifications = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await notificationModel.findAll(req.user.id, pagination);
  const unread = await notificationModel.unreadCount(req.user.id);

  res.json({
    data: result.rows,
    unread,
    meta: paginationMeta(result.total, pagination.page, pagination.limit)
  });
});

const markRead = asyncHandler(async (req, res) => {
  await notificationModel.markRead(req.params.id, req.user.id);
  res.json({ message: 'Notification marked as read.' });
});

const markAllRead = asyncHandler(async (req, res) => {
  await notificationModel.markAllRead(req.user.id);
  res.json({ message: 'All notifications marked as read.' });
});

module.exports = { listNotifications, markRead, markAllRead };
