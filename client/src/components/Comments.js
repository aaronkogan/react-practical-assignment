import  CommentsContainer  from './CommentsContainer'

const Comments = (props) => {

  return (
    <CommentsContainer id={props.id} title={props.title} url={props.url} comments={props.comments} />
  )
}

export default Comments;