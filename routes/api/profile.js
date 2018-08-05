const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateGamesInput = require('../../validation/games');
const validateAnimeInput = require('../../validation/anime');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.steamid) profileFields.steamid = req.body.steamid;
    if (req.body.bio) profileFields.bio = req.body.bio;
    // Skills - Spilt into array
    if (typeof req.body.interests !== 'undefined') {
      profileFields.interests = req.body.interests.split(',');
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   POST api/profile/games
// @desc    Add games to profile
// @access  Private
router.post(
  '/games',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateGamesInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newGame = {
        title: req.body.title,
        platform: req.body.platform
      };

      // Add to exp array
      profile.games.unshift(newGame);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   POST api/profile/anime
// @desc    Add anime to profile
// @access  Private
router.post(
  '/anime',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAnimeInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newAnime = {
        title: req.body.title
      };

      // Add to exp array
      profile.anime.unshift(newAnime);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   DELETE api/profile/games/:game_id
// @desc    Delete game from profile
// @access  Private
router.delete(
  '/games/:game_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.games
          .map(item => item.id)
          .indexOf(req.params.game_id);

        // Splice out of array
        profile.games.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile/anime/:anime_id
// @desc    Delete anime from profile
// @access  Private
router.delete(
  '/anime/:anime_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.anime
          .map(item => item.id)
          .indexOf(req.params.anime_id);

        // Splice out of array
        profile.anime.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);


module.exports = router
