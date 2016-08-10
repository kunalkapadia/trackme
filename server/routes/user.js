import express from 'express';
import userCtrl from '../controllers/user';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/signin')
  .post(userCtrl.createUser)

router.route('/:username')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.getLocation)

  /** PUT /api/users/:userId - Update user */
  .post(userCtrl.addLocation)

  .delete(userCtrl.deleteLocation)


/** Load user when API with userId route parameter is hit */
router.param('username', userCtrl.load);

export default router;
