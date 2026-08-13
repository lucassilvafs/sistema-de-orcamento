import React, { useState, useEffect } from "react";
import "./styles.css";
import logo from "../../images/logo.png";

const PdfFileReceipt = React.forwardRef(({ props }, ref) => {
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);

  const day = new Date().getDate();
  const actualMonth = new Date().getMonth() + 1;
  const monthData = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const year = new Date().getFullYear();
  const month = monthData[actualMonth-1];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('order'));
    if (data) {
      setOrder(data);
      setProducts(data.products);
    }

  }, [ props]);

  // Função auxiliar para formatar CNPJ
  const formatCNPJ = (cnpj) => {
    const cleaned = cnpj?.replace(/\D/g, ""); // remove caracteres não numéricos
    return cleaned?.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  };

  // Função auxiliar para formatar produtos
  const formatProducts = (products) =>
    products
      ?.map((p) => {
        const unidade = p.quant > 1 ? "UNIDADES" : "UNIDADE";
        return `${p.quant} ${unidade} DE ${p.productName.toUpperCase()}`;
      })
      .join(", ");

  // Calcula o total de produtos para ajustar o plural no final
  const totalQuantity = products?.reduce(
    (acc, p) => acc + Number(p.quant || 0),
    0
  );

  const personalizado =
    totalQuantity > 1 ? "PERSONALIZADOS" : "PERSONALIZADO";

  return (
    <div ref={ref} className="container">
      <header className="header">
        <img src={logo} className="logo" alt="logo" />
        <section className="header-info">
          <h1 className="header-title">Empresa Exemplo</h1>
          <p>Tel.: (85) 9XXXX.XXXX / 9XXXX.XXXX</p>
          <p>contato@empresaexemplo.com.br</p>
          <p>www.empresaexemplo.com.br</p>
          <p><em>Instagram: </em>@empresaexemplo</p>
        </section>
      </header>
      <main>
        <p className="title">RECIBO</p>
        <section className="order-info">
          <p className="client-info">
            RECEBEMOS DE {order.clientName?.toUpperCase()}, CNPJ {formatCNPJ(order.cnpj)}, A
            IMPORTÂNCIA DE{" "}
            {Number(order.total).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}{" "}
            REFERENTE À PRODUÇÃO DE {formatProducts(products)} {personalizado}.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>
          Fortaleza, {day} de {month} de {year}
        </p>
        <p>
          Atenciosamente,
        </p>
        <div className="container-footer-info">
          <p>
            Empresa Exemplo
          </p>
          <p>
            CNPJ: xx.xxx.xxx/xxxx-xx
          </p>
          <p>
            Inscrição Municipal: xxx.xxx-x
          </p>
        </div>
        <p>
          www.empresaexemplo.com.br | {year}
        </p>
      </footer>
    </div>
  );
});

export default PdfFileReceipt;
