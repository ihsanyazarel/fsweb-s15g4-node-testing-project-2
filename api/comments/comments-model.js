const db = require('../../data/db-config');

function findCommentById(id) {
    return db('comments')
      .join('posts', 'posts.id', 'post_id')
      .select('comments.*', 'title as post')
      .where('comments.id', id).first();
  }

  function findComments() {
    return db('comments');
  }
  
  function insertComment(comment) {
    return db('comments')
      .insert(comment)
      .then(ids => ({ id: ids[0] }));
  }
  
  module.exports = {
    findComments,
    findCommentById,
    insertComment,
  };