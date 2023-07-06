const router = require("express").Router();
const commentsModel = require("./comments-model");

router.get("/", async (req,res)=>{
    try {
        const comments = await commentsModel.findComments();
        if(comments){
            res.json(comments);
        } else{
            res.status(404).json({ message: "Girilen ID'li yorum bulunamadı." });
        }
    } catch (error) {
        res.status(500).json({ message: "Yorum bilgisi getirilemedi" });
    }
});

router.get("/:id", async (req,res)=>{
    try {
        const comment = await commentsModel.findCommentById(req.params.id);
        if(comment){
            res.json(comment);
        } else{
            res.status(404).json({ message: "Girilen ID'li yorum bulunamadı." });
        }
    } catch (error) {
        res.status(500).json({ message: "Yorum bilgisi getirilemedi" });
    }
});

module.exports = router;