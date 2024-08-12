import React, { useState, useEffect } from "react";
import "./styles.css";
import logo from "../../images/logo.png";

const PDFFileMobile = ({ rerender }) => {
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

  }, [rerender]);

  return (
    <div className="container">
    <header className="header">
      <img src={logo} className="logo" alt="logo da Empresa Fictícia" />
      <section className="header-info">
        <h1 className="header-title">Empresa Fictícia</h1>
        <p>Tel.: (XX) XXXXX.XXXX / XXXXX.XXXX</p>
        <p>contato@empresafictícia.com.br</p>
        <p>www.empresafictícia.com.br</p>
        <p><em>Instagram: </em>@empresa_ficticia</p>
        <p>Rua dos bobos, 000 - Bairro X</p>
      </section>
    </header>
    _______________________________________________________________________________________
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
                  <td>R$ {Number(product.unitValue).toFixed(2)}</td>
                  <td>R$ {Number(product.total).toFixed(2)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <p className="client-info">
          <strong>* Cliente:</strong> {order.clientName}
        </p>
        <p>
          <strong>* Valor total do pedido: R$ {order.total}</strong>
        </p>
        <p>
          <strong>* Tempo de produção:</strong> {order.production} dias úteis
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
            <strong>BANCO: </strong> <span style={{ color: "red" }}>Banco X</span>
          </p>
          <p>
            <strong>AGÊNCIA: </strong> <span style={{ color: "red" }}>0001</span>
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
      </div>
      <p>
        www.empresaficticia.com.br | 2024
      </p>
    </footer>
  </div>
  );
};

export default PDFFileMobile;
