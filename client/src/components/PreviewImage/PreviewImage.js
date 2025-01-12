import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

const PreviewImage = ({ onClick, image, likes, comments, filter, token }) => (
  <figure onClick={onClick} key={image} className="preview-image">
    <img src={process.env.REACT_APP_MEDIA_SERVER_ENDPOINT 
        + '/api/post/image/' + image
        + '?format=png&width=400&height=400&authorization=' 
        + token} alt="User post" style={{ filter }} />
    <div className="preview-image__overlay">
      <span className="preview-image__content">
        {likes > 0 && (
          <div className="preview-image__icon">
            <Icon icon="heart" className="icon--white" />
            <span>{likes}</span>
          </div>
        )}
        <div className="preview-image__icon">
          <Icon icon="chatbubbles" className="icon--white" />
          <span>{comments}</span>
        </div>
      </span>
    </div>
  </figure>
);

PreviewImage.propTypes = {
  onClick: PropTypes.func,
  image: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
};

export default PreviewImage;
