function getPostById(id) {
  const posts = JSON.parse(localStorage.getItem("userPosts") || "[]");
  return posts.find(post => post.id === parseInt(id));
}

function loadPostDetail() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) return;

  const post = getPostById(postId);
  if (!post) return;

  document.getElementById("postTitle").innerText = post.title;
  document.getElementById("postContent").innerText = post.content;
  document.getElementById("postImage").src = "../assets/images/Avatar.png";
  document.getElementById("postLikes").innerText = `${post.likes || 0} Like 👍`;
  document.getElementById("postReplies").innerText = `${post.replies || 0} Replies 💬`;

  // Load comments when the post details are loaded
  renderComments();
}

function addComment() {
  const input = document.getElementById("commentInput");
  const commentText = input.value.trim();
  if (!commentText) return;

  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  const commentsKey = "comments_" + postId;
  const comments = JSON.parse(localStorage.getItem(commentsKey) || "[]");

  const newComment = {
    author: sessionStorage.getItem("loggedInUser") || "Ẩn danh",
    text: commentText,
    date: new Date().toLocaleString()
  };

  comments.push(newComment);
  localStorage.setItem(commentsKey, JSON.stringify(comments));

  input.value = "";
  renderComments();
}

function renderComments() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  const commentsKey = "comments_" + postId;
  const comments = JSON.parse(localStorage.getItem(commentsKey) || "[]");

  const commentList = document.getElementById("commentList");
  commentList.innerHTML = ""; // Clear existing comments

  comments.forEach((cmt, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${cmt.author}</strong> (${cmt.date}): ${cmt.text} 
                    <button onclick="deleteComment(${index})">Xoá</button>`;
    commentList.appendChild(li);
  });
}

// Function to delete a comment
function deleteComment(index) {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  const commentsKey = "comments_" + postId;
  const comments = JSON.parse(localStorage.getItem(commentsKey) || "[]");

  // Remove comment at the specified index
  comments.splice(index, 1);

  // Save updated comments back to localStorage
  localStorage.setItem(commentsKey, JSON.stringify(comments));

  // Re-render the comments
  renderComments();
}

window.onload = loadPostDetail;
