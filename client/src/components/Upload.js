import "./Upload.css";
import { preloadPostImg } from "../reducers/post";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from "react-redux";

const Upload = (props) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [preload, setPreload] = useState(props.preload);
  const [images, setImages] = useState([]);
  const [imagesURLs, setImageURLs] = useState([]);
  useEffect(() => {
    const newImageURLs = [];
    images.forEach(image => newImageURLs.push(URL.createObjectURL(image)));
    setImageURLs(newImageURLs);
  }, [images]);
  const handleChange  = useCallback((e) => {
    setPreload(false);
    e.preventDefault();
    setImages([...e.target.files]);
    dispatch(preloadPostImg(e.target.files.length));
  }, [dispatch]);
  const onButtonUploadClick  = useCallback(() => {
    inputRef.current.click();
  }, []);

  return (
    <React.Fragment>
      <form
        id="form-file-upload"
        onSubmit={(e) => e.preventDefault()}>
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          accept="image/*"
          multiple={false}
          onChange={e => handleChange(e)} />
        <label
          style={(preload) ? { backgroundImage: `url(${props.url})` } : (images[0]) && { backgroundImage: `url(${imagesURLs[0]})` }}
          id="label-file-upload"
          htmlFor="input-file-upload" >
          {!imagesURLs[0] && !preload && <button className="upload-button" onClick={onButtonUploadClick}>Click to select file</button>
          }
        </label>
      </form>
    </React.Fragment>
  )
};

export default Upload;
