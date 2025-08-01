// module.exports = { verifyCaptcha };
const verifyCaptcha = async (req, res, next) => {
  try {
    const { captchaAnswer, captchaText } = req.body;
    if (!captchaAnswer) {
      return res.status(400).json({ message: "Please type the characters shown" });
    }
    if (
      typeof captchaAnswer !== "string" ||
      typeof captchaText !== "string" ||
      captchaAnswer.trim().toLowerCase() !== captchaText.trim().toLowerCase()
    ) {
      return res
        .status(400)
        .json({ message: "Incorrect characters. Please try again." });
    }
    delete req.body.captchaAnswer;
    delete req.body.captchaText;
    next();
  } catch (error) {
    console.error("CAPTCHA verification error:", error);
    return res
      .status(500)
      .json({ message: "CAPTCHA verification failed. Please try again." });
  }
};

module.exports = { verifyCaptcha };
