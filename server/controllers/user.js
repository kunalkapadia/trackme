import User from '../models/user';

/**
 * Load user and append to req.
 */
function load(req, res, next, username) {
  User.getByUsername(username).then((user) => {
    if (!user) {
      user = new User({
        username: username,
        locations: []
      })
    }
    return user.saveAsync()
  }).then(function (savedUser) {
    req.user = savedUser;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function getLocation(req, res) {
  return res.json(req.user);
}

/**
 * Get user list
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function addLocation(req, res, next) {
  const { latitude, longitude, message } = req.body;
  const user = req.user

  console.log('pushing', latitude, longitude, message);
  user.locations.push({
    latitude,
    longitude,
    message
  })

  user.saveAsync()
    .then(function (savedUser) {
      return res.json(savedUser)
    })
    .error((e) => next(e));
}

export default { load, getLocation, addLocation };
