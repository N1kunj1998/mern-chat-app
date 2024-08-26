import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessage = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  // console.log(errorMessage);

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessage, 400));
};

const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("username", "Please Enter Username").notEmpty(),
  body("bio", "Please Enter Bio").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];

const loginValidator = () => [
  body("username", "Please Enter Username").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];

const newGroupChatValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Member must be 2-100"),
];

const addMembersValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 100 })
    .withMessage("Member must be 2-97"),
];

const removeMembersValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("userId", "Please Enter User ID").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
];

const chatIdValidator = () => [param("id", "Please Enter Chat ID").notEmpty()];

const renameValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
  body("name", "Please Enter New Name").notEmpty(),
];

const sendRequestValidator = () => [
  body("receiverId", "Please Enter Receiver Id").notEmpty(),
];

const acceptRequestValidator = () => [
  body("requestId", "Please Enter Request Id").notEmpty(),
  body("isAccepted")
    .notEmpty()
    .withMessage("Please Add isAccepted")
    .isBoolean()
    .withMessage("isAccepted must be a boolean value"),
];

const adminLoginValidator = () => [
    body("secretKey", "Please Enter Secret Key").notEmpty(),
];

export {
  acceptRequestValidator, addMembersValidator, adminLoginValidator, chatIdValidator, loginValidator,
  newGroupChatValidator, registerValidator, removeMembersValidator, renameValidator, sendAttachmentsValidator, sendRequestValidator, validateHandler
};

