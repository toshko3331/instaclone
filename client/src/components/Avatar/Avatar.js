import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Avatar = ({
  imageSrc = require('../../assets/img/default-avatar.png').default,
  className,
  token,
  onClick,
  style,
}) => {
  const avatarClasses = classNames({
    avatar: true,
    [className]: className,
  });

  return (
    <div>
    <img
      className={avatarClasses}
      onClick={onClick}
      style={style}
      src={require('../../assets/img/default-avatar.png').default === imageSrc ?
      require('../../assets/img/default-avatar.png').default :
      process.env.REACT_APP_MEDIA_SERVER_ENDPOINT 
        + '/api/post/image/' + imageSrc
        + '?format=png&width=200&height=200&authorization=' 
        + token}
      alt="Avatar"
    /></div>
  );
};

Avatar.propTypes = {
  imageSrc: PropTypes.string,
  token: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default Avatar;
