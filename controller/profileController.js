const { log } = require("npmlog");
const validator = require("validator");
const Profile = require("../model/Profile");
const User = require("../model/User");
const request = require("request");

// @router GET api/profile/me
// @decs get current user
// @access private
module.exports.me = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate(
      "user"
    );

    if (profile !== null) {
      return res.status(200).json(profile);
    }
    res.status(200).json({ msg: "not has profile" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// @router POST api/profile
// @decs create profile user
// @access private
module.exports.createProfile = async (req, res, next) => {
  const {
    company,
    website,
    location,
    bio,
    status,
    githubUsername,
    skill,
    youtube,
    facebook,
    twitter,
    instagram,
  } = req.body;

  const profileFields = {};
  profileFields.user = req.user._id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubUsername) profileFields.githubUsername = githubUsername;
  if (!skill) {
    profileFields.skill = null;
  }
  if (skill && skill.length === 0) {
    profileFields.skill = skill.split(",").map((val) => val.trim());
  }
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (facebook) profileFields.social.facebook = facebook;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.status(200).json(profile);
    } else {
      profile = await Profile.create(profileFields);
      return res.status(200).json(profile);
    }
  } catch (error) {
    const errors = Object.keys(error.errors);
    const listErr = errors.map((err) => error.errors[err].message);

    res.status(400).json(listErr);
  }
};

// @router GET api/profile
// @decs get all profile user
// @access public
module.exports.getAllProfile = async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    res.send(error.message);
  }
};

// @router GET api/profile/user/:user_id
// @decs get profile by userID
// @access public
module.exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    res.status(200).json(profile);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "profile not found" });
    }
    console.log(error);
    const errors = Object.keys(error.errors);
    const listErr = errors.map((err) => error.errors[err].message);

    res.status(400).json(listErr);
  }
};

// @router GET api/profile/github/:username
// @decs GET profile GitHub
// @access public
module.exports.getGitHubRepos = async (req, res, next) => {
  try {
    const option = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&&client_id=${process.env.githubClientID}&client_secret=${process.env.githubSecret}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(option, (err, response, body) => {
      if (err) {
        throw new Error(err.message);
      } else if (response.statusCode !== 200) {
        res.status(400).send({ msg: "not found" });
      } else {
        res.status(200).send(JSON.parse(body));
      }
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
};

// @router DELETE api/profile/user/:user_id
// @decs delete profile by userID
// @access private
module.exports.deleteProfile = async (req, res, next) => {
  try {
    //remove Profile
    await Profile.findOneAndRemove({
      user: req.params.user_id,
    });
    //remove User
    await User.findOneAndRemove({
      _id: req.params.user_id,
    });

    if (!profile) {
      res.status(400).send("sai cmm");
    }
    res.json(profile);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "profile not found" });
    }
    // console.log(error.message);
    res.send(error.message);
  }
};

// @router PUT api/profile/experience
// @decs add profile experience
// @access private
module.exports.addExperience = async (req, res, next) => {
  const { title, company, location, from, to, current, description } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  };

  try {
    const profile = await Profile.findOne({ user: req.user._id });
    profile.experience.push(newExp);
    await profile.save();
    res.status(200).send(profile);
  } catch (error) {
    const errors = Object.keys(error.errors);
    const listErr = errors.map((err) => error.errors[err].message);

    res.status(400).json(listErr);
  }
};

// @router DELETE api/profile/experience/:exp_id
// @decs delete profile experience
// @access private
module.exports.deleleExperience = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const indexProfile = profile.experience
      .map((item) => {
        return item._id.toString();
      })
      .indexOf(req.params.exp_id);
    profile.experience.splice(indexProfile, 1);
    await profile.save();
    res.status(200).send(profile);
  } catch (error) {
    const errors = Object.keys(error.errors);
    const listErr = errors.map((err) => error.errors[err].message);

    res.status(400).json(listErr);
  }
};

// @router PUT api/profile/education
// @decs add profile education
// @access private
module.exports.addEducation = async (req, res, next) => {
  const { school, degree, fieldofstudy, from, to, current, description } =
    req.body;
  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    profile.education.push(newEdu);
    await profile.save();
    res.status(200).send(profile);
  } catch (error) {
    const errors = Object.keys(error.errors);
    const listErr = errors.map((err) => error.errors[err].message);

    res.status(400).json(listErr);
  }
};

// @router DELETE api/profile/education/:edu_id
// @decs delete profile education
// @access private
module.exports.deleteEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    const indexProfile = profile.education
      .map((item) => {
        return item._id.toString();
      })
      .indexOf(req.params.edu_id);
    profile.education.splice(indexProfile, 1);
    await profile.save();
    res.status(200).send(profile);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
