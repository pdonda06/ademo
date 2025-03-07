import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/company.js';

export const register = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      companyName, 
      taxId, 
      industry, 
      phone 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if company already exists with taxId
    const existingCompany = await Company.findOne({ taxId });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company Tax ID already registered' });
    }

    // Create user first
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      // name will be auto-generated in the pre-save middleware
      role: 'admin'
    });
    
    const savedUser = await user.save();

    // Create company with user reference
    const company = new Company({
      name: companyName,
      taxId,
      industry,
      contactEmail: email,
      phone,
      createdBy: savedUser._id // Add the user reference here
    });
    
    const savedCompany = await company.save();

    // Update user with company reference
    savedUser.companyId = savedCompany._id;
    savedUser.isCompanyOwner = true;
    await savedUser.save();

    // Generate token
    const token = jwt.sign(
      { 
        id: savedUser._id, 
        companyId: savedCompany._id 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: savedUser._id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role
      },
      company: {
        id: savedCompany._id,
        name: savedCompany.name,
        industry: savedCompany.industry
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password included
    const user = await User.findOne({ email })
      .select('+password')
      .populate('companyId');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Use comparePassword method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user._id, 
        companyId: user.companyId?._id 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        role: user.role
      },
      company: user.companyId ? {
        id: user.companyId._id,
        name: user.companyId.name,
        industry: user.companyId.industry
      } : null,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('companyId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        role: user.role
      },
      company: user.companyId ? {
        id: user.companyId._id,
        name: user.companyId.name,
        industry: user.companyId.industry
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
