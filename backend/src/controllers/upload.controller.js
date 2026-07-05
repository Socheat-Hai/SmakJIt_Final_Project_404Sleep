const db = require('../models');
const { VolunteerProfile, Organization } = db;

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const photoUrl = '/uploads/' + req.file.filename;
    const volunteer = await VolunteerProfile.findOne({ where: { user_id: req.user.user_id } });
    if (volunteer) {
      await VolunteerProfile.update(
        { profile_picture: photoUrl },
        { where: { user_id: req.user.user_id } }
      );
    }
    res.json({ photoUrl, message: 'Profile photo updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadOrgLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const logoUrl = '/uploads/' + req.file.filename;
    const org = await Organization.findOne({ where: { owner_id: req.user.user_id } });
    if (org) {
      await Organization.update(
        { logo: logoUrl },
        { where: { owner_id: req.user.user_id } }
      );
    }
    res.json({ logoUrl, message: 'Logo updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadOpportunityImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = '/uploads/' + req.file.filename;
    res.json({ imageUrl, message: 'Image uploaded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadProfilePhoto, uploadOrgLogo, uploadOpportunityImage };
