const prisma = require('../lib/prisma');

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const photoUrl = '/uploads/' + req.file.filename;
    const volunteer = await prisma.volunteer.findUnique({ where: { user_id: req.user.user_id } });
    if (volunteer) {
      await prisma.volunteer.update({
        where: { user_id: req.user.user_id },
        data: { profile_photo: photoUrl },
      });
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
    const org = await prisma.organization.findUnique({ where: { user_id: req.user.user_id } });
    if (org) {
      await prisma.organization.update({
        where: { user_id: req.user.user_id },
        data: { logo: logoUrl },
      });
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
