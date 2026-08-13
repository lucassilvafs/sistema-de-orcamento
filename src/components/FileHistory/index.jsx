import React, { useState, useEffect, useRef } from "react";
import * as C from "./styles";
import Firebase from "../../services/firebaseConnection";
import {
  getDocs,
  setDoc,
  getFirestore,
  collection,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Modal, message, Table, Button, Input, Select } from "antd";
import { useReactToPrint } from 'react-to-print';
import PdfFile from "../PDFFile";
import PdfFileMobile from "../PDFFileMobile";
import PdfFileRecibo from "../PdfFileReceipt";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditFilled,
  FormOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;


const FileHistory = () => {
  const db = getFirestore(Firebase);
  const navigate = useNavigate();

  const componentRef = useRef();
  const componentRefReceipt = useRef();

  const [rerender, setRerender] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    clientName: "",
    production: "",
    total: "",
    cnpj: "",
    payment: "",
    paymentInfo: "",
    payForm: "",
  });

  const ordersCollectionRef = collection(db, "orders");

  const handlePrint = useReactToPrint({// função para printar o PDF
    content: () => componentRef.current,
  });

  const handlePrintReceipt = useReactToPrint({// função para printar o Recibo
      content: () => componentRefReceipt.current,
  });

  // const getOrders = async () => {
  //   setLoading(true);
  //   const data = await getDocs(ordersCollectionRef);
  //   const formatted = data.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  //   setOrders(formatted);
  //   setFilteredOrders(formatted);
  //   setLoading(false);
  // };

  const getOrders = async () => {
    setLoading(true);
    const data = await getDocs(ordersCollectionRef);
  
    const formatted = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    const sorted = formatted.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
      return dateB - dateA; // mais recente primeiro
    });
  
    setOrders(sorted);
    setFilteredOrders(sorted);
    setLoading(false);
  };

  // const getOrders = async () => {
  //   setLoading(true);
  
  //   const q = query(ordersCollectionRef, orderBy("createdAt", "desc"));
  
  //   const data = await getDocs(q);
  
  //   const formatted = data.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  
  //   setOrders(formatted);
  //   setFilteredOrders(formatted);
  //   setLoading(false);
  // };

  useEffect(() => {
    getOrders();
  }, []);

  // const handleShare = async (value) => {// função para preparar o PDF

  //   const order = {
  //     id: generateID(),
  //     clientName,
  //     cnpj,
  //     production,
  //     payment,
  //     paymentInfo,
  //     payForm,
  //     products: arrayProducts,
  //     total,
  //     createdAt: serverTimestamp(),
  //   };

  //   localStorage.setItem("order", JSON.stringify(order));
  //   setRerender(!rerender);

  //   if (value === "Gerar") {
  //     try {
  //       // await addDoc(ordersCollectionRef, order);
  //       await setDoc(doc(db, "orders", order.id.toString()), order);
  //       message.success("✅ Orçamento salvo no histórico com sucesso!");
  //       setTimeout(() => handlePrint(), 1000); // gera o PDF
  //     } catch (error) {
  //       console.error("Erro ao salvar no Firebase:", error);
  //       message.error("❌ Erro ao salvar o orçamento no servidor.");
  //     }
  //     return;
  //   }

  //   setTimeout(() => handlePrintReceipt(), 1000);
  // }

  const filterByDate = (value) => {
    if (!value) {
      setFilteredOrders(orders);
      return;
    }
  
    const now = new Date();
    let startDate;
  
    switch (value) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
  
      case "7":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
  
      case "30":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
  
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
  
      case "lastMonth":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
        
      default:
        setFilteredOrders(orders);
        return;
    }
  
    const filtered = orders.filter((order) => {
      if (!order.createdAt?.toDate) return false;
      const orderDate = order.createdAt.toDate();
      return orderDate >= startDate;
    });
  
    setFilteredOrders(filtered);
  };


  const onSearch = (value) => {
    setSearch(value);
    if (!value) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.clientName?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const onEdit = (order) => {
    setEditingOrder(order);
    setFormValues({
      clientName: order.clientName || "",
      production: order.production || "",
      total: order.total || "",
      cnpj: order.cnpj || "",
      payment: order.payment || "",
      paymentInfo: order.paymentInfo || "",
      payForm: order.payForm || "",
    });
    setModalOpen(true);
  };

  // Função para aplicar máscara de CNPJ
  const formatCNPJ = (value) => {
    if (!value) return "";
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormValues({ ...formValues, cnpj: formatted });
  };

  const handleUpdate = async () => {
    if (!editingOrder) return;

    try {
      await updateDoc(doc(db, "orders", editingOrder.id), {
        clientName: formValues.clientName,
        production: formValues.production,
        total: Number(formValues.total),
        cnpj: formValues.cnpj,
        payment: formValues.payment,
        paymentInfo: formValues.paymentInfo,
        payForm: formValues.payForm,
      });
      message.success("✅ Orçamento atualizado com sucesso!");
      setModalOpen(false);
      setEditingOrder(null);
      getOrders();
    } catch (err) {
      console.error(err);
      message.error("❌ Erro ao atualizar o orçamento.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id.toString()));
      message.success("🗑️ Orçamento excluído!");
      getOrders();
    } catch (err) {
      console.error(err);
      message.error("❌ Erro ao excluir o orçamento.");
    }
  };
  
  const handleSelectOrder = (order) => {
    try {
      localStorage.setItem("order", JSON.stringify(order));
      localStorage.setItem("products", JSON.stringify(order.products));
      message.success("📦 Orçamento salvo no localStorage!");
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      console.error(err);
      message.error("❌ Erro ao salvar no localStorage.");
    }
  };

  const columns = [
    {
      title: "Cliente",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Produtos",
      dataIndex: "products",
      key: "products",
      render: (products) =>
        Array.isArray(products)
          ? products.map((p, i) => (
            <div key={i} style={{ whiteSpace: "pre-wrap" }}>
              • {p.desc}
            </div>
          ))
        : "—",
    },
    {
      title: "Data de Criação",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        value?.toDate
          ? value.toDate().toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : value || "—",
    },
    {
      title: "Valor Total",
      dataIndex: "total",
      key: "total",
      render: (value) =>
        value
          ? Number(value).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : "—",
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <C.ActionButtons>
        <Button
            type="default"
            icon={<FormOutlined />}
            onClick={() => handleSelectOrder(record)}
            style={{
              background: "#ff8c00",
              color: "#fff",
              border: "none",
            }}
          ></Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            style={{ background: "#043659", border: "none" }}
          ></Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          ></Button>
        </C.ActionButtons>
      ),
    },
  ];

  return (
    <C.Container>
      <C.Header>
        <C.SearchContainer>
          <Input
            placeholder="Buscar por cliente..."
            prefix={<SearchOutlined style={{ color: "#aaa" }} />}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            allowClear
            style={{
              borderRadius: "8px",
              padding: "8px 12px",
              maxWidth: "320px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          />
        </C.SearchContainer>

        <Select
        placeholder="Filtrar por período"
        style={{ width: 200}}
        onChange={filterByDate}
        allowClear
      >
        <Option value="today">Hoje</Option>
        <Option value="7">Últimos 7 dias</Option>
        <Option value="30">Últimos 30 dias</Option>
        <Option value="month">Este mês</Option>
        <Option value="lastMonth">Mês passado</Option>
      </Select>
      </C.Header>

      <C.TableContainer>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: true }}
        />
      </C.TableContainer>

      <Modal
        title="Editar Orçamento"
        open={modalOpen}
        okText="Salvar"
        cancelText="Cancelar"
        onCancel={() => setModalOpen(false)}
        onOk={handleUpdate}
      >
        <C.InputGroup>
          <C.Label>Cliente</C.Label>
          <C.Input
            value={formValues.clientName}
            onChange={(e) =>
              setFormValues({ ...formValues, clientName: e.target.value })
            }
          />
        </C.InputGroup>

        <C.InputGroup>
          <C.Label>CNPJ</C.Label>
          <C.Input
            value={formValues.cnpj}
            onChange={handleCNPJChange}
            placeholder="00.000.000/0000-00"
            maxLength={18}
          />
        </C.InputGroup>

        <C.InputGroup>
          <C.Label>Produção (dias úteis)</C.Label>
          <C.Input
            type="number"
            value={formValues.production}
            onChange={(e) =>
              setFormValues({ ...formValues, production: e.target.value })
            }
          />
        </C.InputGroup>

        <C.InputGroup>
          <C.Label>Forma de Pagamento</C.Label>
          <Select
            value={formValues.payment}
            onChange={(value) =>
              setFormValues({ ...formValues, payment: value })
            }
            style={{ width: "100%" }}
          >
            <Option value="Pix">Pix</Option>
            <Option value="Transferência">Transferência</Option>
          </Select>
        </C.InputGroup>

        <C.InputGroup>
          <C.Label>Informações de Pagamento</C.Label>
          <Select
            value={formValues.paymentInfo}
            onChange={(value) =>
              setFormValues({ ...formValues, paymentInfo: value })
            }
            style={{ width: "100%" }}
          >
            <Option value="Leonardo">Leonardo</Option>
            <Option value="Carol">Carol</Option>
          </Select>
        </C.InputGroup>

        <C.InputGroup>
          <C.Label>Condição de Pagamento</C.Label>
          <C.Input
            value={formValues.payForm}
            onChange={(e) =>
              setFormValues({ ...formValues, payForm: e.target.value })
            }
          />
        </C.InputGroup>

        <C.InputGroup>
          <C.Label>Valor Total (R$)</C.Label>
          <C.Input
            type="number"
            value={formValues.total}
            onChange={(e) =>
              setFormValues({ ...formValues, total: e.target.value })
            }
          />
        </C.InputGroup>
      </Modal>

      <div style={{ display:"none" }}>
        <PdfFile props={rerender} ref={componentRef} />
      </div>

      <div style={{ display:"none" }}>
        <PdfFileRecibo props={rerender} ref={componentRefReceipt} />
      </div>

      <div id="content-id" style={{ display:"none" }} className="container-ex">
        <PdfFileMobile rerender={rerender} />
      </div>
    </C.Container>
  );
};

export default FileHistory;
