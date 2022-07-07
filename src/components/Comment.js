import React from 'react';

export default function Comment({ comment }) {
//   const { id, text } = comment
  return (
    <li className='comment-container'>
      <span>{comment}</span>
    </li>
  );
}
