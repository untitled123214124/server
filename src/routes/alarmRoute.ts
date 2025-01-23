import {
  updateNotificationStatus,
  getNotificationsByUserId,
} from '../controllers/alarmController';

import {
  updateNotificationStatusValidator,
  getNotificationsByUserIdValidator,
  validate,
} from '../validators/alarmValidator';
import express from 'express';

const router = express.Router();

// 알림 본 것으로 처리
router.patch(
  '/:notificationId',
  updateNotificationStatusValidator,
  validate,
  updateNotificationStatus
);

// 사용자 ID로 알림 정보 가져오기
router.get(
  '/:userId',
  getNotificationsByUserIdValidator,
  validate,
  getNotificationsByUserId
);

export default router;
