exports.register = async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;
      
      const user = new User({ username, email, phone, password });
      await user.save();
  
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      });
    } catch (error) {
      res.status(400).json({
        error: 'Registration failed',
        details: error.message.includes('duplicate key') ? 
          'Username/Email/Phone already exists' : 
          error.message
      });
    }
  };