import  Comments from './Comments'

const CommentsContainer = (props) => {

  return (
    <Comments id={props.id} title={props.title} url={props.url} comments={props.comments} />
  )
}

export default CommentsContainer;