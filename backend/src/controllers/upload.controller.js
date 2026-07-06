const volunteerProfileRepository = require('../repositories/volunteerProfile.repository');
const orgRepository = require('../repositories/organization.repository');
const oppRepository = require('../repositories/opportunity.repository');

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const photoUrl = '/uploads/' + req.file.filename;
    await volunteerProfileRepository.update(req.user.user_id, { profile_picture: photoUrl });
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
    await orgRepository.updateByOwnerId(req.user.user_id, { logo: logoUrl });
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
    if (req.body.opp_id) {
      await oppRepository.update(parseInt(req.body.opp_id), { image: imageUrl });
    }
    res.json({ imageUrl, message: 'Image uploaded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadProfilePhoto, uploadOrgLogo, uploadOpportunityImage };
