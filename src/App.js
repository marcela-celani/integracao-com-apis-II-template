import React, { useEffect, useState } from "react";
import axios from "axios";
import { EditarUsuario } from "./components/EditarUsuario/Editar";
import AddUsuario from "./components/CadastraUsuario/AddUsuario";
import { Header } from "./components/Header/Header";
import {
  ContainerPrincipal,
  ContainerBarra,
  ButtonCadastro,
  BoxCadastro,
} from "./Appstyle";
import { BASE_URL } from "./constants/BASE_URL";
import { AUTH_TOKEN } from "./constants/AUTH_TOKEN";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [pageFlow, setPageFlow] = useState(1);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pesquisa, setPesquisa] = useState({ nome: "", email: "" });

  useEffect(() => {
    getUsuarios();
  }, []);

  useEffect(() => {
    pesquisaUsuario(pesquisa);
  }, [pesquisa]);

  const getUsuarios = () => {
    axios
      .get(
        BASE_URL,
        {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        }
      )
      .then((res) => {
        setUsuarios(res.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const pesquisaUsuario = async (pesquisa) => {
    
    try {
      const resp = await axios.get(`${BASE_URL}/search?name=${pesquisa.nome}&email=${pesquisa.email}`, {
        headers: {
          Authorization: AUTH_TOKEN
        }
      })

      resp.data.length ? setUsuarios(resp.data) : getUsuarios()

      console.log(resp)
    } catch (error) {
      console.log(error)
    }
  };

  const onChangeName = (e) => {
    setNome(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const enviarDados = () => {
    const novaPesquisa = {
      nome,
      email,
    };
    setPesquisa(novaPesquisa);
   
    setNome("")
    setEmail("")

    pesquisaUsuario()
    
  };

  const onClickVoltar = () => {
    getUsuarios();
    setPageFlow(1)
  }

  return (
    <div>
      <Header />
      <ContainerPrincipal>
        {pageFlow === 2 ? (
          <BoxCadastro>
            <button onClick={() => setPageFlow(1)}>Voltar</button>
            <AddUsuario getUsuarios={getUsuarios} />
          </BoxCadastro>
        ) : (
          <>
            <ContainerBarra>
              <div>
                <input
                  value={nome}
                  onChange={onChangeName}
                  placeholder="Nome"
                />
                <input
                  value={email}
                  onChange={onChangeEmail}
                  placeholder="Email"
                />
                <button type="submit" onClick={enviarDados}>
                  Pesquisar
                </button>
              </div>
              {pageFlow === 3 ? (
                <ButtonCadastro onClick={onClickVoltar}>Voltar</ButtonCadastro>
              ) : (
                <ButtonCadastro onClick={() => setPageFlow(2)}>
                  Cadastrar
                </ButtonCadastro>
              )}
              
            </ContainerBarra>
            {usuarios.map((usuario) => {
              return (
                <EditarUsuario
                  key={usuario.id}
                  id={usuario.id}
                  getUsuarios={getUsuarios}
                  setPageFlow={setPageFlow}
                  pageFlow={pageFlow}
                />
              );
            })}
          </>
        )}
        
      </ContainerPrincipal>
    </div>
  );
}

export default App;
