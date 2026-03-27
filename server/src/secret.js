require('dotenv').config({ quiet: true });

const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL = process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceMernDB";

const defaultImagePath = process.env.DEFAULT_IMAGE_PATH || 'public/images/users/defaultUser.png';


module.exports = { serverPort, mongodbURL, defaultImagePath }