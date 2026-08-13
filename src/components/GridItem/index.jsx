import React from "react";
import * as C from "./styles";
import { EditOutlined, DeleteOutlined, SearchOutlined, EditFilled } from "@ant-design/icons";
import { Button,} from "antd";

const GridItem = ({ item, onDelete, onEdit }) => {
  return (
    <C.Tr>
      <C.TdText>{item.productName}</C.TdText>
      <C.TdText>{item.desc}</C.TdText>
      {/* <C.TdNumber>R$ {Number(item.unitValue).toFixed(2)}</C.TdNumber> */}
      <C.TdNumber>{Number(item.unitValue).toLocaleString("pt-BR", {style: "currency", currency: "BRL",})}</C.TdNumber>
      <C.TdNumber>{item.quant}</C.TdNumber>
      {/* <C.TdNumber>R$ {Number(item.total).toFixed(2)}</C.TdNumber> */}
      <C.TdNumber>{Number(item.total).toLocaleString("pt-BR", {style: "currency", currency: "BRL",})}</C.TdNumber>
      <C.TdNumber alignCenter>
        {/* <EditOutlined style={{ marginRight:"25px", cursor: "pointer"}} onClick={() => onEdit(item.id)} />
        <DeleteOutlined danger style={{ cursor: "pointer" }} onClick={() => onDelete(item.id)} /> */}
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => onEdit(item.id)}
          style={{ background: "#043659",  cursor: "pointer" , marginRight: "20px"}}
        ></Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          style={{ cursor: "pointer",  borderRadius:"30%" }}
          onClick={() => onDelete(item.id)}
        ></Button>
      </C.TdNumber>
    </C.Tr>
  );
};

export default GridItem;
