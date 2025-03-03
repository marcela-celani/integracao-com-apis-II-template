import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ButtonNome,
  DeleteButton,
  ButtonContainer,
  MainContainer,
  InputContainer,
  SaveButton,
  CloseButton,
} from "./style";
import { AiOutlineDelete } from "react-icons/ai";
import { Input } from "../../Appstyle";
import { BASE_URL } from "../../constants/BASE_URL";
import { AUTH_TOKEN } from "../../constants/AUTH_TOKEN";

export const EditarUsuario = (props) => {
  const [usuario, setUsuario] = useState({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [editar, setEditar] = useState(false);

  const getDadosUsuario = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${props.id}`, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });

      setUsuario(response.data);
      setEmail(response.data.email);
      setName(response.data.name);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    getDadosUsuario();
  }, []);

  const editaUsuario = async () => {
    try {
      const body = {
        name,
        email,
      };

      await axios.put(`${BASE_URL}/${usuario.id}`, body, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });

      getDadosUsuario();
      setEditar(!editar);
    } catch (error) {
      console.log(error.response);
    }
  };

  const deletarUsuario = () => {
    axios
      .delete(`${BASE_URL}/${usuario.id}`, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      })
      .then(() => {
        alert("usuario removido");
        // chama de novo o get usuarios pra atualizar a lista
        props.getUsuarios();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <MainContainer>
      {editar ? (
        <InputContainer>
          <Input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SaveButton onClick={editaUsuario}>Salvar</SaveButton>
          <CloseButton onClick={() => setEditar(!editar)}>Fechar</CloseButton>
        </InputContainer>
      ) : (
        <ButtonContainer>
          <ButtonNome onClick={() => setEditar(!editar)}>
            {usuario.name}
          </ButtonNome>
          <DeleteButton onClick={deletarUsuario}>
            <AiOutlineDelete />
          </DeleteButton>
        </ButtonContainer>
      )}
    </MainContainer>
  );
};
