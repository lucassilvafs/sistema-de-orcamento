import React, { useState, useEffect, useRef } from "react";
import Grid from "../Grid";
import * as C from "./styles";
import CardItem from "../CardItem";
import { FaAngleLeft, FaAngleRight, FaCalendarAlt } from "react-icons/fa";
import Firebase from "../../services/firebaseConnection";
import { addDoc, getDocs, doc, setDoc, getFirestore, collection, serverTimestamp } from "firebase/firestore";

import { useReactToPrint } from 'react-to-print';
import PdfFile from "../PDFFile";
import PdfFileMobile from "../PDFFileMobile";
import PdfFileRecibo from "../PdfFileReceipt";
import { Modal, message, DatePicker } from 'antd';
import { ExclamationCircleFilled, CalendarOutlined } from '@ant-design/icons';
import "../PDFFile/styles.css";

import html2pdf from "html2pdf.js";

const db = getFirestore(Firebase);
const productsCollectionRef = collection(db, "products");

const Form = ({ handleAdd, productsList, setProductsList, total, orderInfo }) => {
  const [clientName, setClientName] = useState("");
  const [payForm, setPayForm] = useState("50% no fechamento e o restante quando o material tiver pronto");
  const [productName, setProductName] = useState("");
  const [quant, setQuant] = useState("");
  const [desc, setDesc] = useState("");
  const [unitValue, setUnitValue] = useState("");
  const [production, setProduction] = useState("");
  const [cnpj, setCnpj] = useState('');
  const [payment, setPayment] = useState('Pix');
  const [paymentInfo, setPaymentInfo] = useState('Leonardo');
  const [dataProducts, setDataProducts] = useState([]);
  const [dataProductsFilter, setDataProductsFilter] = useState([]);
  const [dataProductsSearch, setDataProductsSearch] = useState([]);

  const [inputText, setInputText] = useState('');
  const [rerender, setRerender] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [date, setDate] = useState(null);

  const [nameToSearch, setNameToSearch] = useState('');

  const [modalProductName, setmodalProductName] = useState("");
  const [modalQuant, setmodalQuant] = useState("");
  const [modalDesc, setmodalDesc] = useState("");
  const [modalUnitValue, setmodalUnitValue] = useState("");
  const [modalTextOK, setModalTextOK] = useState('Confirmar');

  const componentRef = useRef();
  const componentRefReceipt = useRef();
  const containerRef = useRef();
  const { confirm } = Modal;

  const ordersCollectionRef = collection(db, "orders");

  const onEdit = (name) => {
    setNameToSearch(name);
    
    const productForEdit = productsList.find((productItem) => productItem.productName === name);
    setmodalProductName(productForEdit.productName);
    setmodalDesc(productForEdit.desc);
    setmodalUnitValue(productForEdit.unitValue);
    setmodalQuant(productForEdit.quant);

    setModalEditOpen(true);
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Tem certeza que deseja apagar tudo?',
      icon: <ExclamationCircleFilled />,
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk() {
        localStorage.removeItem('products'); 
        localStorage.removeItem('order');
        reloadPage();
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    const getData = async () => {
      const data = await getDocs(productsCollectionRef);
      setDataProductsSearch(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setDataProductsFilter(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getData();

    if(orderInfo) {
      setClientName(orderInfo.clientName);
      setProduction(orderInfo.production === 'Indeterminado' ? '0' : orderInfo.production);
      setCnpj(orderInfo.cnpj ? orderInfo.cnpj : '');
      setPayment(orderInfo.payment ? orderInfo.payment : 'Pix');
      setPaymentInfo(orderInfo.paymentInfo ? orderInfo.paymentInfo : 'Leonardo');
      setPayForm(orderInfo.payForm ? orderInfo.payForm : '50% no fechamento e o restante quando o material tiver pronto');
    }

    const localProducts = localStorage.getItem("productsData");

    if (localProducts) {
      try {
        const parsedProducts = JSON.parse(localProducts);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          setDataProducts(parsedProducts);
          setDataProductsFilter(parsedProducts);
          return;
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }, []);

  const getTodayBR = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Orçamento - ${clientName} - ${getTodayBR()}`,
    pageStyle: `
      @page { size: A4 portrait; margin: 15mm; }
      html, body { height: auto !important; overflow: visible !important; }
    `
  });

  const handlePrintReceipt = useReactToPrint({
    content: () => componentRefReceipt.current,
    documentTitle: `Recibo - ${clientName} - ${getTodayBR()}`,
    pageStyle: `
      @page { size: A4 portrait; margin: 15mm; }
      html, body { height: auto !important; overflow: visible !important; }
    `
  });

  const generatePdfMobile = () => {
    const element = componentRef.current;
  
    const filename = `Orçamento - ${clientName} - ${getTodayBR()}.pdf`;
  
    html2pdf()
      .set({
        margin: 10,
        filename,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  const handleShare = async (value) => {
    const arrayProducts = JSON.parse(localStorage.getItem('products'));
    const generateID = () => Math.round(Math.random() * 1000000000);

    if (!clientName) {
      alert("Informe o nome do cliente");
      return;
    }

    if (production && date) {
      alert("O orçamento NÃO pode ter tempo de produção e data de entrega ao mesmo tempo");
      return;
    }

    if (!production && !date) {
      alert("O orçamento NÃO pode ficar sem tempo de produção e data de entrega ao mesmo tempo");
      return;
    }

    if (arrayProducts.length === 0) {
      alert("Por favor, adicione um ou mais produtos para gerar o documento!");
      return;
    }

    const order = {
      id: generateID(),
      clientName,
      cnpj:cnpj,
      date,
      production:production === '0' ? 'Indeterminado' : production,
      payment:payment,
      paymentInfo:paymentInfo,
      payForm:payForm,
      products: arrayProducts,
      total,
      createdAt: serverTimestamp(),
    };

    localStorage.setItem("order", JSON.stringify(order));
    setRerender(!rerender);

    if (value === "Gerar") {
      try {
        await setDoc(doc(db, "orders", order.id.toString()), order);
        message.success("Orçamento salvo no histórico com sucesso!");
        setTimeout(() => generatePdfMobile(), 1000);
      } catch (error) {
        message.error("Erro ao salvar o orçamento no servidor.");
      }
      return;
    }

    if(!cnpj) {
      alert('Preencha o campo CPNJ do cliente');
      return;
    }

    setTimeout(() => handlePrintReceipt(), 1000);
  }

  const handleChange = (target) => {
    const text = target.value.toLowerCase();
    setInputText(text);
  
    if (!text.trim()) {
      setDataProductsFilter(dataProductsSearch);
      return;
    }
  
    const filtered = dataProductsSearch.filter((product) =>
      product.name.toLowerCase().includes(text)
    );
  
    setDataProductsFilter(filtered);
  };

  const handleAddInfo = (name) => {
    const product = dataProductsSearch.find((product) => product.name === name);

    setProductName(product.name);
    setQuant(product.quant_min);
    setDesc(product.desc);
    setUnitValue(Number(product.price).toFixed(2));

    setModalOpen(true);
  };

  const handleScroll = (scrollAmount) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const generateID = () => Math.round(Math.random() * 1000000000);

  const handleSave = () => {
    if (!productName || !quant) {
      alert("Informe o produto e a quantidade!");
      return;
    }
    
    if (unitValue <= 0 || quant < 1) {
      alert("Os valores tem que ser positivos!");
      return;
    }

    const products = {
      id: generateID(),
      productName,
      desc,
      unitValue,
      quant,
      total: unitValue * quant,
    };

    handleAdd(products);

    setProductName("");
    setDesc("");
    setUnitValue("");
    setQuant(""); 

    setModalOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!modalProductName || !modalDesc) {
      alert("Informe o produto e a descrição!");
      return;
    }
    
    if (modalUnitValue <= 0 || modalQuant < 1) {
      alert("Os valores tem que ser positivos!");
      return;
    }

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
    setCnpj(formatted);
  };

  const reloadPage = () => window.location.reload();

  const pickerRef = useRef(null);

  // const openPicker = () => {
  //   if (pickerRef.current) {
  //     pickerRef.current.showPicker();
  //   }
  // };

  // const formatDateBR = (value) => {
  //   if (!value) return "";
  //   const [ano, mes, dia] = value.split("-");
  //   return `${dia}/${mes}/${ano}`;
  // };

  return (
    <>
      <C.TopContainer>
        <C.SubContainer>
          <C.InputContent>
            <C.Label>Nome do cliente</C.Label>
            <C.TopInput value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </C.InputContent>

          <C.InputContent>
            <C.Label>Tempo de produção (dias úteis)</C.Label>
            <C.TopInput style={{ width: "250px" }}
              value={production}
              type="number"
              onChange={(e) => setProduction(e.target.value)}
            />
          </C.InputContent>

          <C.InputContent>
            <C.Label>Tipo de pagamento</C.Label>
            <C.Select name="selectedPay" value={payment} onChange={(e) => setPayment(e.target.value)}>
              <C.Option value="Pix">Pix</C.Option>
              <C.Option value="Transferência">Transferência</C.Option>
            </C.Select>
          </C.InputContent>
        </C.SubContainer>

        <C.SubContainer>
          
          <C.InputContent>
            <C.Label>CNPJ do cliente</C.Label>
            <C.TopInput 
              value={cnpj} onChange={handleCNPJChange}
            />
          </C.InputContent>

          <C.InputContent>
            <C.Label>Forma de pagamento</C.Label>
            <C.TopInput value={payForm} onChange={(e) => setPayForm(e.target.value)} />
          </C.InputContent>

        </C.SubContainer>
      </C.TopContainer>

      <Modal
        open={modalOpen}
        okButtonProps={{ style: { backgroundColor: "#F29215", borderWidth: 0} }}
        onOk={handleSave}
        okText="Adicionar"
        onCancel={() => setModalOpen(false)}
        cancelText="Cancelar"
      >
        <C.ContainerModal>
          <C.InputContent>
            <C.Label>Nome do produto</C.Label>
            <C.Input value={productName} onChange={(e) => setProductName(e.target.value)} />
          </C.InputContent>

          <C.InputContent>
            <C.Label>Descrição</C.Label>
            <C.InputDesc value={desc} onChange={(e) => setDesc(e.target.value)} />
          </C.InputContent>

          <C.InputContent>
            <C.Label>Valor Unitário</C.Label>
            <C.Input
              value={unitValue}
              type="number"
              onChange={(e) => setUnitValue(e.target.value)}
            />
          </C.InputContent>

          <C.InputContent>
            <C.Label>Quantidade</C.Label>
            <C.Input
              value={quant}
              type="number"
              onChange={(e) => setQuant(e.target.value)}
            />
          </C.InputContent>
        </C.ContainerModal>
      </Modal>

      <Modal
        title="Insira os novos valores"
        open={modalEditOpen}
        okButtonProps={{ style: { backgroundColor: "#F29215", borderWidth: 0} }}
        onOk={handleSaveEdit}
        okText={modalTextOK}
        onCancel={() => setModalEditOpen(false)}
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
      
      <C.ItemsContainer>
        <C.HeaderTitle>Produtos</C.HeaderTitle>
        <C.InputSearch
          onChange={ (e) => handleChange(e.target) }
          placeholder="Procurar"
        />

        <C.CarouselWrapper>
          <C.ButtonScroll direction="left" onClick={() => handleScroll(-400)}>
            <FaAngleLeft style={{ height:"20px", width:"20px" }} />
          </C.ButtonScroll>

          <C.CardContainer ref={containerRef}>
            {(() => {
              const list = inputText ? dataProductsFilter : dataProductsSearch;

              if (list.length === 0) {
                return (
                  <div style={{ 
                    width: "100%", 
                    textAlign: "center", 
                    padding: "20px", 
                    color: "#777",
                    fontSize: "16px" 
                  }}>
                    Nenhum produto encontrado
                  </div>
                );
              }

              return list.map((data) => (
                <CardItem
                  key={data.name}
                  name={data.name}
                  price={data.price}
                  quantMin={data.quant_min}
                  handleAddInfo={handleAddInfo}
                />
              ));
            })()}
          </C.CardContainer>

          <C.ButtonScroll direction="right" onClick={() => handleScroll(400)}>
            <FaAngleRight style={{ height:"20px", width:"20px" }}/>
          </C.ButtonScroll>
        </C.CarouselWrapper>

      </C.ItemsContainer>

      <C.GridContainer>
        <Grid itens={productsList} setItens={setProductsList} onEdit={onEdit} handleAdd={handleAdd} generateID={generateID} />
      </C.GridContainer>

      <div style={{ display:"none" }}>
        <PdfFile props={rerender} ref={componentRef} />
      </div>

      <div style={{ display:"none" }}>
        <PdfFileRecibo props={rerender} ref={componentRefReceipt} />
      </div>

      <div id="content-id" style={{ display:"none" }} className="container-ex">
        <PdfFileMobile rerender={rerender} />
      </div>
      
      <C.ResumeDiv>
        <C.ResumeContainer>
          <C.HeaderTitleResume>Total</C.HeaderTitleResume>
          <C.Footer>
            <C.Total>{Number(total).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</C.Total>
          </C.Footer>
          <C.ButtonDownload value="Gerar" onClick={(e) => handleShare(e.target.value)}>Gerar Orçamento</C.ButtonDownload>
          <C.ButtonTotalContainer>
            <C.ButtonReceipt value="Recibo" onClick={(e) => handleShare(e.target.value)}>Fazer Recibo</C.ButtonReceipt>
            <C.ButtonErase onClick={showDeleteConfirm}>Apagar Tudo</C.ButtonErase>
          </C.ButtonTotalContainer>
        </C.ResumeContainer>
      </C.ResumeDiv>
    </>
  );
};

export default Form;