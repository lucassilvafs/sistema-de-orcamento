import React, { useState, useEffect } from "react";
import "./styles.css";
import logo from "../../images/logo.png";
import { Modal } from 'antd';

const PDFFileMobile = ({ rerender }) => {
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
  }, [setIsLoading, rerender]);

  return (
      // <div id="content-id" className="container-ex">
        <div className="container">
          <header className="header">
            <img src={logo} className="logo" alt="logo da Empresa Fictícia" />
            <section className="header-info">
              <h1 className="header-title">Empresa Fictícia</h1>
              <p>Tel.: (85) 9XXXX.XXXX / 9XXXX.XXXX</p>
              <p>contato@empresaficticia.com.br</p>
              <p>www.empresaficticia.com.br</p>
              <p><em>Instagram: </em>@empresa_ficticia</p>
              <p>Rua dos bobos, 000</p>
            </section>
          </header>
          _________________________________________________________________________________________________
          <main>
            <section className="order-info">
              <h4>Segue nossa proposta conforme solicitado:</h4>
              <table className="table-items">
                <thead>
                  <tr>
                    <th className="td-table">Quantidade</th>
                    <th className="desc-table">Produto/Serviço</th>
                    <th className="td-table">Valor Unitário</th>
                    <th className="td-table">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  { products?.map((product, index) => (
                      <tr key={index}>
                        <td>{product.quant}</td>
                        <td>{product.desc}</td>
                        <td>{Number(product.unitValue).toLocaleString("pt-BR", {style: "currency", currency: "BRL",})}</td>
                        <td>{Number(product.total).toLocaleString("pt-BR", {style: "currency", currency: "BRL",})}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <p className="client-info">
                <strong>* Cliente:</strong> {order.clientName}
              </p>
              <p>
                <strong>* Valor total do pedido: {Number(order.total).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</strong>
              </p>
              <p>
                <strong>* Tempo de produção:</strong>{" "}
                {order.production && order.production > 0
                  ? `${order.production} ${order.production > 1 ? "dias úteis" : "dia útil"}`
                  : "Indeterminado"}
              </p>
              <p>
                <strong>* Tipo de pagamento: </strong> {order.payment}
              </p>
              <p>
                <strong>* Forma de pagamento: </strong> 50% no fechamento e o restante quando o material tiver pronto
              </p>
              <p>
                <strong>* OBS: Este orçamento tem validade de 15 dias. Após este período, favor consulte-nos novamente. Todos os preços informados estão expressos em Reais (R$) e são exclusivos para este orçamento. O serviço será executado no País: BRASIL, Estado: CEARÁ, Cidade: FORTALEZA. </strong>
              </p>
            </section>
            <section className="payment-info">
              <div>
                <h3>DADOS BANCÁRIOS</h3>
                <p>
                  <strong>BANCO: </strong> <span style={{ color: "red" }}>Banco Genérico</span>
                </p>
                <p>
                  <strong>AGÊNCIA: </strong> <span style={{ color: "red" }}>0000</span>
                </p>
                <p>
                  <strong>CONTA: </strong> <span style={{ color: "red" }}>XXXXXXXX-X</span>
                </p>
              </div>
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
                Empresa Fictícia
              </p>
              <p>
                CNPJ: XX.XXX.XXX/XXXX-XX
              </p>
              <p>
                Inscrição Municipal: XXX.XXX-X
              </p>
            </div>
            <p>
              www.empresaficticia.com.br | {year}
            </p>
          </footer>
        </div>
  );
};

export default PDFFileMobile;
