const User = require('../models/user');

const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.error(error);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.error(error);
    }
}

const getUserProfile = async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch user profile' });
        console.error(error);
    }
}

const updateUserProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send({ error: error.message });
        console.error(error);
    }
}

const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); 
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        await user.deleteOne();
        res.send(req.user);
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete user profile' });
        console.error(error);
    }
}

const logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to log out' });
        console.error(error);
    }
}

const logoutAllUsers = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send({ message: 'Logged out from all devices successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to log out from all devices' });
        console.error(error);
    }
}

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch user' });
        console.error(error);
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch users' });
        console.error(error);
    }
}

module.exports = {
    createUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    logoutUser,
    logoutAllUsers,
};
