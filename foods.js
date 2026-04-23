// Food database: macros per 100g unless noted
// { name, calories, fat, protein, carbs, fiber, serving, servingUnit }
const FOOD_DATABASE = [
  // Meats
  { name: "Chicken Breast (grilled)", calories: 165, fat: 3.6, protein: 31, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Ground Beef 80/20", calories: 254, fat: 17.9, protein: 26, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Salmon (baked)", calories: 208, fat: 13, protein: 20, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Bacon (cooked)", calories: 541, fat: 42, protein: 37, carbs: 1.4, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Pork Chop (grilled)", calories: 231, fat: 14, protein: 26, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Tuna (canned in water)", calories: 116, fat: 0.8, protein: 26, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Steak (ribeye)", calories: 291, fat: 22, protein: 24, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Turkey Breast", calories: 135, fat: 1, protein: 30, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Shrimp (boiled)", calories: 99, fat: 1.1, protein: 24, carbs: 0.2, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Lamb Chop", calories: 294, fat: 21, protein: 26, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Pepperoni", calories: 494, fat: 44, protein: 21, carbs: 0.8, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Sausage (pork)", calories: 301, fat: 26, protein: 17, carbs: 1.6, fiber: 0, serving: 100, servingUnit: "g" },

  // Eggs & Dairy
  { name: "Egg (whole, large)", calories: 78, fat: 5.3, protein: 6.3, carbs: 0.6, fiber: 0, serving: 50, servingUnit: "g (1 egg)" },
  { name: "Egg (scrambled)", calories: 149, fat: 11, protein: 10, carbs: 1.6, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Cheddar Cheese", calories: 403, fat: 33, protein: 25, carbs: 1.3, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Mozzarella Cheese", calories: 280, fat: 22, protein: 28, carbs: 2.2, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Parmesan Cheese", calories: 431, fat: 29, protein: 38, carbs: 4, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Cream Cheese", calories: 342, fat: 34, protein: 6, carbs: 4.1, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Butter", calories: 717, fat: 81, protein: 0.9, carbs: 0.1, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Heavy Whipping Cream", calories: 340, fat: 36, protein: 2.1, carbs: 2.8, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Sour Cream", calories: 193, fat: 19, protein: 2.4, carbs: 4.6, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Greek Yogurt (full fat)", calories: 97, fat: 5, protein: 9, carbs: 3.8, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Cottage Cheese (full fat)", calories: 206, fat: 9, protein: 25, carbs: 6, fiber: 0, serving: 100, servingUnit: "g" },

  // Vegetables (low carb)
  { name: "Spinach (raw)", calories: 23, fat: 0.4, protein: 2.9, carbs: 3.6, fiber: 2.2, serving: 100, servingUnit: "g" },
  { name: "Broccoli", calories: 55, fat: 0.6, protein: 3.7, carbs: 11, fiber: 2.6, serving: 100, servingUnit: "g" },
  { name: "Cauliflower", calories: 25, fat: 0.3, protein: 2, carbs: 5, fiber: 2, serving: 100, servingUnit: "g" },
  { name: "Zucchini", calories: 17, fat: 0.3, protein: 1.2, carbs: 3.1, fiber: 1, serving: 100, servingUnit: "g" },
  { name: "Kale (raw)", calories: 49, fat: 0.9, protein: 4.3, carbs: 8.8, fiber: 3.6, serving: 100, servingUnit: "g" },
  { name: "Cabbage (green)", calories: 25, fat: 0.1, protein: 1.3, carbs: 5.8, fiber: 2.5, serving: 100, servingUnit: "g" },
  { name: "Lettuce (romaine)", calories: 17, fat: 0.3, protein: 1.2, carbs: 3.3, fiber: 2.1, serving: 100, servingUnit: "g" },
  { name: "Avocado", calories: 160, fat: 14.7, protein: 2, carbs: 8.5, fiber: 6.7, serving: 100, servingUnit: "g" },
  { name: "Cucumber", calories: 16, fat: 0.1, protein: 0.7, carbs: 3.6, fiber: 0.5, serving: 100, servingUnit: "g" },
  { name: "Bell Pepper (green)", calories: 31, fat: 0.3, protein: 1, carbs: 7, fiber: 2.5, serving: 100, servingUnit: "g" },
  { name: "Asparagus", calories: 20, fat: 0.1, protein: 2.2, carbs: 3.9, fiber: 2.1, serving: 100, servingUnit: "g" },
  { name: "Mushrooms", calories: 22, fat: 0.3, protein: 3.1, carbs: 3.3, fiber: 1, serving: 100, servingUnit: "g" },
  { name: "Celery", calories: 16, fat: 0.2, protein: 0.7, carbs: 3, fiber: 1.6, serving: 100, servingUnit: "g" },
  { name: "Onion", calories: 40, fat: 0.1, protein: 1.1, carbs: 9.3, fiber: 1.7, serving: 100, servingUnit: "g" },
  { name: "Garlic", calories: 149, fat: 0.5, protein: 6.4, carbs: 33, fiber: 2.1, serving: 100, servingUnit: "g" },

  // Nuts & Seeds
  { name: "Almonds", calories: 579, fat: 50, protein: 21, carbs: 22, fiber: 12.5, serving: 100, servingUnit: "g" },
  { name: "Pecans", calories: 691, fat: 72, protein: 9.2, carbs: 14, fiber: 9.6, serving: 100, servingUnit: "g" },
  { name: "Macadamia Nuts", calories: 718, fat: 76, protein: 7.9, carbs: 13.8, fiber: 8.6, serving: 100, servingUnit: "g" },
  { name: "Walnuts", calories: 654, fat: 65, protein: 15, carbs: 14, fiber: 6.7, serving: 100, servingUnit: "g" },
  { name: "Chia Seeds", calories: 486, fat: 31, protein: 17, carbs: 42, fiber: 34, serving: 100, servingUnit: "g" },
  { name: "Flaxseed", calories: 534, fat: 42, protein: 18, carbs: 29, fiber: 27, serving: 100, servingUnit: "g" },
  { name: "Peanut Butter (natural)", calories: 588, fat: 50, protein: 25, carbs: 20, fiber: 6, serving: 100, servingUnit: "g" },
  { name: "Sunflower Seeds", calories: 584, fat: 51, protein: 21, carbs: 20, fiber: 8.6, serving: 100, servingUnit: "g" },

  // Oils & Fats
  { name: "Olive Oil", calories: 884, fat: 100, protein: 0, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Coconut Oil", calories: 892, fat: 100, protein: 0, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Avocado Oil", calories: 884, fat: 100, protein: 0, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "MCT Oil", calories: 900, fat: 100, protein: 0, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Mayo (full fat)", calories: 680, fat: 75, protein: 1, carbs: 0.6, fiber: 0, serving: 100, servingUnit: "g" },

  // Keto-friendly fruits
  { name: "Raspberries", calories: 52, fat: 0.7, protein: 1.2, carbs: 11.9, fiber: 6.5, serving: 100, servingUnit: "g" },
  { name: "Blackberries", calories: 43, fat: 0.5, protein: 1.4, carbs: 9.6, fiber: 5.3, serving: 100, servingUnit: "g" },
  { name: "Strawberries", calories: 32, fat: 0.3, protein: 0.7, carbs: 7.7, fiber: 2, serving: 100, servingUnit: "g" },
  { name: "Blueberries", calories: 57, fat: 0.3, protein: 0.7, carbs: 14.5, fiber: 2.4, serving: 100, servingUnit: "g" },
  { name: "Lemon", calories: 29, fat: 0.3, protein: 1.1, carbs: 9.3, fiber: 2.8, serving: 100, servingUnit: "g" },

  // Keto snacks / other
  { name: "Pork Rinds", calories: 544, fat: 31, protein: 61, carbs: 0, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Dark Chocolate (85%+)", calories: 598, fat: 43, protein: 8, carbs: 46, fiber: 11, serving: 100, servingUnit: "g" },
  { name: "Pepperoni Slices", calories: 494, fat: 44, protein: 21, carbs: 0.8, fiber: 0, serving: 100, servingUnit: "g" },
  { name: "Beef Jerky (plain)", calories: 338, fat: 15, protein: 36, carbs: 12, fiber: 0.5, serving: 100, servingUnit: "g" },

  // Beverages
  { name: "Black Coffee", calories: 2, fat: 0, protein: 0.3, carbs: 0, fiber: 0, serving: 240, servingUnit: "ml (1 cup)" },
  { name: "Bulletproof Coffee", calories: 230, fat: 25, protein: 0.5, carbs: 0.5, fiber: 0, serving: 240, servingUnit: "ml (1 cup)" },
  { name: "Unsweetened Almond Milk", calories: 15, fat: 1.2, protein: 0.6, carbs: 0.6, fiber: 0.4, serving: 240, servingUnit: "ml (1 cup)" },
  { name: "Sparkling Water", calories: 0, fat: 0, protein: 0, carbs: 0, fiber: 0, serving: 355, servingUnit: "ml (1 can)" },
  { name: "Green Tea (unsweetened)", calories: 2, fat: 0, protein: 0.2, carbs: 0.5, fiber: 0, serving: 240, servingUnit: "ml (1 cup)" },
];

const KETO_LIMITS = {
  netCarbs: 20,      // grams - strict keto
  calories: 1800,    // kcal - adjust per user
  fat: 140,          // grams
  protein: 130,      // grams
};
