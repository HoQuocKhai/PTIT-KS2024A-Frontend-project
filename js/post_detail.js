// detail.js
function getPostById(id) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    return posts[id];
  }
  
  function loadPostDetail() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");
  
    if (!postId) return;
  
    const post = getPostById(postId);
    if (!post) return;
  
    document.getElementById("postTitle").innerText = post.title;
    document.getElementById("postContent").innerText = post.content;
    document.getElementById("postImage").src = post.imageUrl || "../assets/images/default.png";
    document.getElementById("postLikes").innerText = `${post.likes || 0} Like 👍`;
    document.getElementById("postReplies").innerText = `${post.replies || 0} Replies 💬`;
  }
  
  window.onload = loadPostDetail;
  