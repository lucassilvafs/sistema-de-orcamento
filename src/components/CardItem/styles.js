import styled from "styled-components";

export const productDiv = styled.div`
  align-items: center;
  box-shadow: 2.759px 2.759px 5.518px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  height: 50px;
  width: 190px;
  justify-content: center;
  /* gap: 40px; */
  margin-inline: 10px;
`;

export const customBtn = styled.button`
  width: 190px;
  height: 50px;
  color: #fff;
  border-radius: 5px;
  padding: 5px;
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5),
  7px 7px 20px 0px rgba(0,0,0,.1),
  4px 4px 5px 0px rgba(0,0,0,.1);
  outline: none;
`;

export const btn14 = styled.button`
  background: rgb(255,151,0);
  border: none;
  z-index: 1;

  &:after {
    position: absolute;
    content: "";
    width: 100%;
    height: 0;
    top: 0;
    left: 0;
    z-index: -1;
    border-radius: 5px;
    background-color: #FFB703;
    background-image: linear-gradient(315deg, #FFB703 0%, #FFB703 74%);
    box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5);
    transition: all 0.3s ease;
  }

  &:hover {
    color: #fff;
  }

  &:hover {
    &:after {
    top: auto;
    bottom: 0;
    height: 100%;
    }
  }

  &:active {
    top: 2px;
  }
`;
