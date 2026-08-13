import React, { useState } from "react";
import GridItem from "../GridItem";
import * as C from "./styles";

import { Modal } from 'antd';

const Grid = ({ itens, setItens, handleAdd, generateID }) => {
  const onDelete = async (id) => {
    const newArray = itens.filter((product) => product.id !== id);
    setItens(newArray);
    await localStorage.setItem("products", JSON.stringify(newArray));
    const data = localStorage.getItem("products");
    console.log('deleteiy' , newArray, data);
  };

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  const [, setIdToSearch] = useState('');

  const [modalProductName, setmodalProductName] = useState("");
  const [modalQuant, setmodalQuant] = useState("");
  const [modalDesc, setmodalDesc] = useState("");
  const [modalUnitValue, setmodalUnitValue] = useState("");
  const [modalProductId, setModalProductId] = useState("");
  const [modalTextOK] = useState('Confirmar');
  const [currentObjectToEdit, setCurrentObjectToEdit] = useState("");

  const [, setProductName] = useState("");
  const [, setQuant] = useState("");
  const [, setDesc] = useState("");
  const [, setUnitValue] = useState("");

  const onEdit = (id) => {
    setIdToSearch(id);
    
    const productForEdit = itens.find((productItem) => productItem.id === id);
    setCurrentObjectToEdit(productForEdit);

    console.log('produto pra editar',productForEdit);
    setModalProductId(productForEdit.id);
    setmodalProductName(productForEdit.productName);
    setmodalDesc(productForEdit.desc);
    setmodalUnitValue(productForEdit.unitValue);
    setmodalQuant(productForEdit.quant);

    setModalEditOpen(true);

    onDelete(id);
  };

  const handleSaveEdit = () => {
    if (!modalProductName || !modalDesc) {
      alert("Informe o produto e a descrição!");
      return;
    }
    
    if (modalUnitValue <= 0 || modalQuant < 1) {
      alert("Os valores tem que ser positivos!");
      return;
    }
    // productsList = itens

    const products = {
      id: generateID(),
      productName: modalProductName,
      desc: modalDesc,
      unitValue: modalUnitValue,
      quant: modalQuant,
      total: modalUnitValue * modalQuant,
    };

    handleAdd(products);

    setProductName("");
    setDesc("");
    setUnitValue("");
    setQuant(""); 

    setModalEditOpen(false);
  };

  const handleCancel = (target) => {
    handleAdd(currentObjectToEdit);
    setModalEditOpen(false);
    
  }


  return (
    <C.Table>
      <C.Thead>
        <C.Tr>
          <C.ThText width={20}>Nome do produto</C.ThText>
          <C.ThText width={30}>Descrição</C.ThText>
          <C.ThNumber width={12}>Valor unitário</C.ThNumber>
          <C.ThNumber width={12}>Quantidade</C.ThNumber>
          <C.ThNumber width={15}>Total</C.ThNumber>
          {/* <C.Th width={10} alignCenter>
            Tipo
          </C.Th> */}
          <C.ThNumber width={25}></C.ThNumber>
        </C.Tr>
      </C.Thead>
      <C.Tbody>
        {itens?.map((item, index) => (
          <GridItem key={index} item={item} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </C.Tbody>

      <Modal
        title="Insira os novos valores"
        open={modalEditOpen}
        okButtonProps={{ style: { backgroundColor: "#F29215", borderWidth: 0} }}
        onOk={handleSaveEdit}
        okText={modalTextOK}
        onCancel={handleCancel}
        cancelText="Cancelar"
      >
        <C.TopContainerModal>
          <C.InputContentModal>
            <C.LabelModal>Nome do produto</C.LabelModal>
            <C.InputModal value={modalProductName} onChange={(e) => setmodalProductName(e.target.value)} />
          </C.InputContentModal>

          <C.InputContentModal>
            <C.LabelModal>Descrição</C.LabelModal>
            <C.InputDescModal value={modalDesc} onChange={(e) => setmodalDesc(e.target.value)} />
          </C.InputContentModal>

          <C.InputContentModal>
            <C.LabelModal>Valor unitário</C.LabelModal>
            <C.InputModal
              value={modalUnitValue}
              type="number"
              onChange={(e) => setmodalUnitValue(e.target.value)}
            />
          </C.InputContentModal>

          <C.InputContentModal>
            <C.LabelModal>Quantidade</C.LabelModal>
            <C.InputModal
              value={modalQuant}
              type="number"
              onChange={(e) => setmodalQuant(e.target.value)}
            />
          </C.InputContentModal>
        </C.TopContainerModal>
      </Modal>
    </C.Table>
  );
};

export default Grid;
