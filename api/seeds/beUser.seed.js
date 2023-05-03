const validationError = require("../utils/validationError");
const {UserModel} = require("../models/beUser.model");

setTimeout(async () => {
    const userContent = {
        email: "mkromi.dev@gmail.com",
        username: "mkromi",
        password: "123456",
        superAdmin: true,
    };

    const user = new UserModel(userContent);

    const validation = await  validationError.uniqueCheck(await UserModel.isUnique(userContent.username, userContent.email));

    if (Object.keys(validation).length === 0) {
        const newUser = await user.save();
        console.log(newUser);
    } else {
        console.log(validation)
    }

}, 1100);
