const commentsModel = require("./comments-model");
const db = require("../../data/db-config");
const supertest = require("supertest");
const server  =require("../server");

beforeAll(async ()=> {
    await db.migrate.rollback();
    await db.migrate.latest();
});

beforeEach(async ()=>{
    await db.seed.run();
});

test("1 - find comments", async ()=>{
    const res = await supertest(server).get("/api/comments");
    expect(res.body).toHaveLength(12);
    const comments = await commentsModel.findComments();
    expect(res.body).toEqual(comments);
})

test("2 - find comment by id", async ()=>{
    const res = await supertest(server).get("/api/comments/4");
    expect(res.body).toHaveProperty("id", 4);
    const comment = await commentsModel.findCommentById(4);
    expect(res.body).toEqual(comment);
})

test("3 - find comment by id, wrong id", async ()=>{
    const res = await supertest(server).get("/api/comments/13");
    expect(res.body.message).toBe("Girilen ID'li yorum bulunamadı.");
    expect(res.status).toBe(404);
})