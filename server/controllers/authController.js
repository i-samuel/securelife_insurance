const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const { generateToken } = require('../utils/jwt');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both email and password.',
      });
    }

    const user = await userModel.findByEmail(email);
    if (!user || !user.is_active) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role_name,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role_name,
          roleId: user.role_id,
        },
      },
    });
  } catch (error) {
    console.error('Error in login controller:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during login.',
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(444).json({
        status: 'fail',
        message: 'User profile not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role_name,
          roleId: user.role_id,
          createdAt: user.created_at,
        },
      },
    });
  } catch (error) {
    console.error('Error in getMe controller:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error fetching user profile.',
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const users = await userModel.getAllUsers({ role, search });

    return res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error fetching users.',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { roleId, firstName, lastName, email, password } = req.body;

    if (!roleId || !firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required user registration fields.',
      });
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'A user with this email address already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser({
      roleId,
      firstName,
      lastName,
      email,
      passwordHash,
    });

    return res.status(201).json({
      status: 'success',
      message: 'User account created successfully.',
      data: { user: newUser },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error creating user.',
    });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await userModel.getRoles();
    return res.status(200).json({
      status: 'success',
      data: { roles },
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error fetching roles.',
    });
  }
};

module.exports = {
  login,
  getMe,
  getUsers,
  createUser,
  getRoles,
};
