import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  max-width: 1120px;

  @media (max-width: 750px) {
    width: 1000px;
    background-color: #fff;
    padding: 20px;
    max-width: 1120px;
}
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

export const ThText = styled.th`
  text-align: start;
  border-bottom: inset;
  padding-bottom: 5px;
  // text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width + "%" : "auto")};
`;

export const ThNumber = styled.th`
  text-align: center;
  border-bottom: inset;
  padding-bottom: 5px;
  // text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width + "%" : "auto")};
`;

export const ContainerModal = styled.div`
  max-width: 1120px;
  margin: 20px auto;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 15px 0px;
  gap: 10px;

  @media (max-width: 750px) {
    display: grid;
  }
`;

export const InputContentModal = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LabelModal = styled.label`
`;

export const InputModal = styled.input`
  outline: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

export const InputDescModal = styled.textarea`
  outline: none;
  font-family: Poppins;
  resize: none;
  border-radius: 5px;
  padding: 5px 10px;
  height: 70px;
  font-size: 15px;
  border: 1px solid #ccc;
`;


export const TopContainerModal = styled.div`
  max-width: 1120px;
  margin: 20px auto;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 15px 0px;
  gap: 10px;

  @media (max-width: 750px) {
    display: grid;
  }
`;
