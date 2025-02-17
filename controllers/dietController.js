const Diet = require('../models/dietModel');
const Preferences = require('../models/userPreferencesModel.js');
const { generateDietPlan } = require('../services/chatgpt.js'); // Ensure this import exists

// ✅ Function to generate a diet plan
exports.generateDietPlan = async (req, res) => {
  try {

    const userId = req?.user?.userId;
    //const user = await User.findById(req.user.userId);
    console.log('userId', userId)
    
    const userPreferences = await Preferences.findOne({ userId: userId });
    console.log('generatinggggggggg', userPreferences)
    if (!userPreferences) return res.status(404).json({ message: 'User not found' });


     //console.log({user})
    const dietPlan = await generateDietPlan({
      weight: userPreferences.weight,
      height: userPreferences.height,
      age: userPreferences.age,
      days: userPreferences.days,
      gender: userPreferences.gender,
      favoriteFoods: userPreferences.favoriteFoods,
      dislikedFoods: userPreferences.dislikedFoods,
    });


     const newDiet = new Diet({
      userId: req.user.userId,
      dietPlan: dietPlan,
          });
      const savedDiet = await newDiet.save();

 

    // const newDiet = await Diet.create(
    //   { userId: req.user.userId },
    //   { dietPlan: dietPlan },
    //   //{ new: true, upsert: true }
    // );

    console.log('savedDiet',savedDiet)

    res.json(newDiet);
  } catch (error) {

    console.log('erorrrrr', error)
    res.status(500).json({ message: 'Error generating diet plan', error });
  }
};

// ✅ Function to get the saved diet plan
exports.getDietPlan = async (req, res) => {
  try {
    const dietPlan = await Diet.findOne({ userId: req.user.userId });
    if (!dietPlan) return res.status(404).json({ message: 'No diet plan found' });

    res.json(dietPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving diet plan', error });
  }
};
