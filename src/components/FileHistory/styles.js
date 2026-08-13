import styled from "styled-components";

export const Container = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 40px 80px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;

export const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  input {
    border-radius: 25px;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid #ddd;

    &:focus {
      border-color: #ff8c00;
      box-shadow: 0px 0px 5px rgba(255, 140, 0, 0.4);
    }
  }
`;

export const TableContainer = styled.div`
  background-color: #fff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

export const Label = styled.label`
  font-weight: 600;
  margin-bottom: 5px;
  color: #444;
`;

export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #222;

  &:focus {
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15);
  }

  &::placeholder {
    color: #999;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;

  button {
    border-radius: 10px !important;
    font-weight: 600;
  }
`;
