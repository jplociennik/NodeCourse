const fs = require('fs');
const path = require('path');

const removeTaskImage = async (imageFileName) => {
  if (!imageFileName) return;
  const imagePath = path.join(__dirname, '../../public/uploads/tasks/', imageFileName);
  await fs.unlink(imagePath);
}

module.exports = { removeTaskImage }; 