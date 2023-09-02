import "./Posts.css";
import { useDispatch, useSelector } from "react-redux";
import { getPost,editPost,deletePost,selectPosts } from "../reducers/posts";


const Posts = () => {
    const posts = useSelector(selectPosts);
    let parsed = JSON.parse(JSON.stringify(posts));
    let result = {};
    let parseResult = [];
    let postsCount = 0;
    if(parsed) {
        result = (parsed["result"]) 
        for(var i = 0; i < result.length; i++) {
            parseResult[result[i].id] = [result[i].id, result[i].title, result[i].username, result[i].imageSrc, result[i].likes, result[i].dislikes, result[i].date, result[i].comments];
            postsCount++;
        }}    
        parseResult.shift();
    console.log(JSON.stringify(parseResult));
        return (
            <div className="posts">
                <article role="main">
                    {parseResult.map((post, i) => (
                            <div key={i+1}>{post} | {i+1} | </div>
                        ))}
                </article>
{/* <table>
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>username</th>
            <th>imageSrc</th>
            <th>likes</th>
            <th>dislikes</th>
            <th>date</th>
            <th>comments</th>
          </tr>
        </thead>
        <tbody>
          {parseResult.map(post => {
            return (
              <tr>
                <td key={i}>{post[0]}</td>
                <td key={i}>{post[1]}</td>
                <td key={i}>{post[2]}</td>
                <td key={i}>{post[3]}</td>
                <td key={i}>{post[4]}</td>
                <td key={i}>{post[5]}</td>
                <td key={i}> {post[6]}</td>
                <td key={i}>{post[7]}</td>
              </tr>
            );
          })}
        </tbody>
      </table> */}
                <p>
                {postsCount}
                </p>
          </div>
        );
};

export default Posts;