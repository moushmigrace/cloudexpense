import { createProfile, getProfileByUserId, updateProfile } from '../models/profileModel.js';

export const createProfileController = async (req, res) => {
  try {
    const profile = await createProfile(req.body);
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfileController = async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.params.user_id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const profile = await updateProfile(req.params.user_id, req.body);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
