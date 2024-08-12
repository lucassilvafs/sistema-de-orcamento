import React from 'react';
import './styles.css';

const CardItem = ({ name, price, quantMin, handleAddInfo }) => {
    return (
      <div className="product-div">
        <button className='custom-btn btn-14' onClick={() => handleAddInfo(name)}>
          {name}
        </button>
      </div>
    );
  }

export default CardItem;