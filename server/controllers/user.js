import User from '../models/user';
import Promise from 'bluebird';
import APIError from '../../server/helpers/APIError';

/**
 * Load user and append to req.
 */
function load(req, res, next, username) {
  User.getByUsername(username).then((user) => {
    if (!user) {
      const error = new APIError('no such user exists', 400, true);
      return next(error);
    }
    req.user = user;		// eslint-disable-line no-param-reassign
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

function deleteLocation (req, res, next) {
  const { locationId } = req.body;
  const user = req.user;
  let locations = user.locations;

  console.log('deleteId', locationId);

  locations = locations.filter(function (location) {
    console.log('comparing with', location._id.toString())
    return location._id.toString() != locationId
  })
  user.locations = locations
  user.saveAsync()
    .then(function (savedUser) {
      return res.json(savedUser)
    })
    .error((e) => next(e));
}

function createUser (req, res, next) {
  const { username, password } = req.body;
  User.getByUsername(username).then((user) => {
    if (!user) {
      user = new User({
        username: username,
        password: password,
        locations: []
      })
    } else if (user.password != password) {
      const error = new APIError('Invalid password', 400, true);
      return Promise.reject(error)
    }
    return user.saveAsync()
  }).then(function (savedUser) {
    return res.json(savedUser)
  }).error((e) => next(e));
}

export default { load, createUser, getLocation, addLocation, deleteLocation };
