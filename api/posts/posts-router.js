const router = require("express").Router();
const postModel = require("./posts-model");

// get all posts
router.get("/", async (req, res)=>{
    try {
        const posts = await postModel.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Gönderiler alınamadı" });
    }
});

//get post by id
router.get("/:id", async (req,res)=>{
    try {
        const post = await postModel.findById(req.params.id);
        if(post){
            res.json(post);
        } else{
            res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        }
    } catch (error) {
        res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    }
});


router.post("/", async (req,res)=>{
    try {
        const {title, contents} = req.body;
        if(!title || !contents){
            res.status(400).json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
        } else{
            const newPostId = await postModel.insert(req.body);
            const newPost = await postModel.findById(newPostId.id);
            res.status(201).json(newPost);
        }
    } catch (error) {
        res.status(500).json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
});


router.put("/:id", async (req,res)=>{
    try {
        const post = await postModel.findById(req.params.id);
        if(post){
            const {title, contents} = req.body;
            if(!title || !contents){
                res.status(400).json({ message: "Lütfen gönderi için title ve contents sağlayın" });
            }else{
                await postModel.update(req.params.id, req.body);
                const updatedPost = await postModel.findById(req.params.id);
                res.json(updatedPost);
            }
        } else{
            res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
        }
    } catch (error) {
        res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    }
});


router.delete("/:id", async (req,res)=>{
    try {
        const post = await postModel.findById(req.params.id);
        if(post){
            await postModel.remove(req.params.id);
            res.json(post);
        } else {
            res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
        }
    } catch (error) {
        res.status(500).json({ message: "Gönderi silinemedi" });
    }
});


router.get("/:id/comments", async (req,res)=>{
    try {
        const post = await postModel.findById(req.params.id);
        if(post){
            const comments = await postModel.findPostComments(req.params.id);
            res.json(comments);
        } else{
            res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
        }
    } catch (error) {
        res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
    }
});

module.exports = router;