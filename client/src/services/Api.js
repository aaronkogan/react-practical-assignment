const baseUrl = 'http://localhost:8080';

export async function fetchPosts (query) {
    const res = await fetch(baseUrl + '/post/page/' + query, { method: 'GET', headers: { 'Content-Type': 'Authorization' } });
    return await res.json();
  };

export async function lastPageFetch () {
    const res = await fetch(baseUrl + '/post/page/1', { method: 'GET', headers: { 'Content-Type': 'Authorization' } });
    var json = await res.json();
    const totalPages = json.totalPages;
    return (totalPages <= 1) ? json :  json = await fetchPosts(totalPages)
};

export async function fetchSearch(query) {
    const res = await fetch(baseUrl + '/post/search/' + query, { method: 'GET', headers: { 'Content-Type': 'Authorization' } });
    return await res.json();
};

export async function fetchEditPost(query, id) {
  const res = await fetch(baseUrl + '/post/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: query });
  return await res.json();
};

export async function postDelete(id) {
  const res = await fetch(baseUrl + '/post/' + id, { method: 'DELETE', headers: { 'Content-Type': 'Authorization' } });
  return await res.json();
};

export const postInit = async (query) => {
    const res = await fetch(baseUrl + '/post/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: query });
    var json = await res.json();
    if (json.success) return await postImg(JSON.stringify(json.result.id));
  };

export const postImg = async (postId) => {
const formData = new FormData();
formData.append("picture", document.getElementById('input-file-upload').files[0]);
const res = await fetch(baseUrl + '/post/' + postId + '/picture', { method: 'POST', headers: { 'Accept': '/' }, body: formData });
return await res.json();
};

export async function addComment(query) {
  const res = await fetch(baseUrl + '/comment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: query });
  return await res.json();
};

export async function delComment(commentId) {
  const res = await fetch(baseUrl + '/comment/' + commentId, { method: 'DELETE', headers: { 'Content-Type': 'Authorization' } });
  return await res.json();
};

export async function fetchEditComment(commentId, query) {
  const res = await fetch(baseUrl + '/comment/' + commentId, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: query });
  return await res.json();
};
