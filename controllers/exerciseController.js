const Exercise = require('../models/exerciseModel.js');
const Preferences = require('../models/userPreferencesModel.js');
const { generateExercise } = require('../services/chatgptexercise.js');


exports.generateExercise = async (req, res) => {
    try {
  
      const userId = req?.user?.userId;
      //const user = await User.findById(req.user.userId);
      console.log('userId', userId)
      
      const userPreferences = await Preferences.findOne({ userId: userId });
      console.log('generatinggggggggg', userPreferences)
      if (!userPreferences) return res.status(404).json({ message: 'User not found' });
  
  
       //console.log({user})
      const exercisePlan = await generateExercise({
        weight: userPreferences.weight,
        height: userPreferences.height,
        age: userPreferences.age,
        days: userPreferences.days,
        gender: userPreferences.gender,
      });
  
  
       const newExercise = new Exercise({
        userId: req.user.userId,
        exercisePlan: exercisePlan,
            });
        const savedExercise = await newExercise.save();
  
      // const newExercise = await Exercise.create(
      //   { userId: req.user.userId },
      //   { exercisePlan: exercisePlan },
      //   //{ new: true, upsert: true }
      // );
  
      console.log('savedExercise',savedExercise)
  
      res.json(newExercise);
    } catch (error) {
  
      console.log('erorrrrr', error)
      res.status(500).json({ message: 'Error generating Exercise plan', error });
    }
  };

  // ✅ Function to get the saved diet plan
exports.getExercisePlan = async (req, res) => {
    try {
      const exerciseplan = await Exercise.findOne({ userId: req.user.userId });
      if (!exerciseplan) return res.status(404).json({ message: 'No diet plan found' });
  
      res.json(exerciseplan);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving diet plan', error });
    }
  };