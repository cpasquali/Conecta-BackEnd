import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "conectablog2@gmail.com",
    pass: "aoiftxicrfphphvd",
  },
});
