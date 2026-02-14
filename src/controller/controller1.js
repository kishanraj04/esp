export const matchPassword = (req, res) => {
  console.log("Received body:", req.body);

  return res.status(200).json({
    msg: "hii",
    received: req.body
  });
};
