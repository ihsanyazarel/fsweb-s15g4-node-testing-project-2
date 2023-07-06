const postModel = require("./posts-model");
const db = require("../../data/db-config");
const supertest = require("supertest");
const server  =require("../../api/server");

beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
});

beforeEach(async ()=>{
    await db.seed.run();
});

test("1 - simple test", ()=>{
    expect(true).toBe(true);
    expect(process.env.NODE_ENV).toBe("testing");
});

test("2 - get all posts", async ()=>{
    const res = await supertest(server).get("/api/posts");
    expect(res.body).toHaveLength(9);
    const posts = await postModel.find();
    expect(res.body).toEqual(posts);
})

test("3 - get post by id", async ()=>{
    const res = await supertest(server).get("/api/posts/1");
    expect(res.body).toHaveProperty("id", 1);
    const post = await postModel.findById(1);
    expect(res.body).toEqual(post);
})

test("4 - create post", async ()=>{
    const newPost = {title: "post test title", contents: "post test content"}
    const res = await supertest(server).post("/api/posts").send(newPost);
    expect(res.body).toHaveProperty("title", "post test title");
    const post = await postModel.findById(10);
    expect(res.body).toEqual(post);
})

test("5 - create post, wrong body", async ()=>{
    const newPost = {title: "post test title"}
    const res = await supertest(server).post("/api/posts").send(newPost);
    expect(res.body.message).toBe("Lütfen gönderi için bir title ve contents sağlayın");
})

test("6 - update post", async ()=>{
    const newPost = {title: "post test title", contents: "post test content"}
    const res = await supertest(server).put("/api/posts/1").send(newPost);
    expect(res.body).toHaveProperty("title", "post test title");
    const post = await postModel.findById(1);
    expect(res.body).toEqual(post);
})

test("7 - delete post", async ()=>{
    const res = await supertest(server).delete("/api/posts/1");
    expect(res.body).toHaveProperty("id", 1);
    const posts = await postModel.find();
    expect(posts).toHaveLength(8);
    expect(posts[0]).toHaveProperty("id", 2);
    const post = await postModel.findById(1);
    expect(post).toEqual(undefined);
})

test("8 - find comments of a post", async ()=>{
    const res = await supertest(server).get("/api/posts/4/comments");
    expect(res.body).toHaveLength(3);
    const comments = await postModel.findPostComments(4);
    expect(res.body).toEqual(comments);
})
