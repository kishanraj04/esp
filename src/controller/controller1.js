import Light from "../model/Lights.js";

export const matchPassword = (req, res) => {
  console.log("Received body:", req.body);

  return res.status(200).json({
    msg: "hii",
    received: req.body.password
  });
};



export const onLight = async (req, res) => {
  const { lightno } = req.params;
  const { status } = req.body;
  try {
    const light = await Light.findOneAndUpdate(
      { lightno: lightno },
      { status: status, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    return res.status(200).json({
      msg: `Light ${lightno} turned ${status}`,
      light
    });
  } catch (error) {
    console.error("Error updating light status:", error);
    return res.status(500).json({
      msg: "Error updating light status",
      error: error.message
    });
  }
}
