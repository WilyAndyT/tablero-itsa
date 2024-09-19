import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Typography, theme, Divider, Radio } from "antd";
import logo from "./assets/Logo Tomebamba negro.png";
import { FilaTablero } from "./Fila";
import "./assets/styles.css"; // Importa el archivo de estilos
const apiUrl = import.meta.env.VITE_URL_API;

const { Header, Content } = Layout;

const App = () => {
  const [visibleGroup, setVisibleGroup] = useState(0);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [tecnicoss, setTecnicos] = useState([]);
  const [clave, setClave] = useState("a");

  useEffect(() => {
    obtenerTecnicos();
    const intervalId = setInterval(obtenerTecnicos, 300000);
    return () => clearInterval(intervalId);
  }, [clave]);

  const obtenerTecnicos = async () => {
    try {
      const body = {
        agencia: "08",
        tipo: clave === "a" ? "MEC" : "LAT",
        dia: "5",
      };

      const res = await axios.post(
        apiUrl, // La URL de tu API
        body, // El cuerpo de la solicitud
        {
          headers: {
            Authorization:
              "dfa5b24e-a654-4f4c-b3f3-edd8e4a444d8!1efd02f3af567a7aa6dba7b8a773cebbde07f0f9ccf7f0d0ebd8647eefeddb67980bc780a37484", // Token de autorización
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res.data); // Imprimir los datos de la respuesta
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Ejemplo de datos
  const horas = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18];
  const tecnicos1 = [
    { name: "BAY EXPRESS", orden: "OT1", hora: 14, tipo: "ACTUAL" },
    { name: "BAY EXPRESS", orden: "OT3", hora: 9, tipo: "PLAN" },
    { name: "TECNICO 1", orden: "OT4", hora: 11, tipo: "ACTUAL" },
    { name: "TECNICO 1", orden: "OT5", hora: 9, tipo: "PLAN" },
    { name: "TECNICO 1", orden: "OT8", hora: 8, tipo: "ACTUAL" },
    { name: "TECNICO 1", orden: "OT6", hora: 8, tipo: "PLAN" },
  ];

  const tecnicosMap = []; // Usamos un objeto para almacenar los técnicos únicos

  tecnicos1.forEach((tecnico) => {
    // Si el técnico no está en el objeto, lo añadimos
    if (!tecnicosMap[tecnico.name]) {
      tecnicosMap[tecnico.name] = {
        name: tecnico.name,
        ordenes: [], // Inicializamos una lista para las órdenes
      };
    }

    // Agregamos la orden al técnico correspondiente
    tecnicosMap[tecnico.name].ordenes.push({
      orden: tecnico.orden,
      tipo: tecnico.tipo,
      hora: tecnico.hora,
    });
  });

  // Convertimos el objeto de técnicos en un array
  const tecnicos = Object.values(tecnicosMap);

  const tecnicosPorGrupo = 1;
  const totalGrupos = Math.ceil(tecnicos.length / tecnicosPorGrupo);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleGroup((prevGroup) => (prevGroup + 1) % totalGrupos);
    }, 15000);

    return () => clearInterval(interval);
  }, [totalGrupos]);

  // Obtener el grupo de técnicos a mostrar
  const tecnicosAMostrar = tecnicos.slice(
    visibleGroup * tecnicosPorGrupo,
    (visibleGroup + 1) * tecnicosPorGrupo
  );

  const onChange = (e) => {
    console.log(`radio checked:${e.target.value}`);
    setClave(e.target.value);
  };

  return (
    <Layout
      style={{
        maxHeight: "100vh",
      }}
    >
      {/* Header */}
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          alignItems: "center",
          background: "#d9d9d9",
          maxHeight: "50px",
        }}
      >
        <img src={logo} className="demo-logo" width="120px" alt="Logo" />
      </Header>

      {/* Main Content */}
      <Content>
        <Layout
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            marginTop: 2,
          }}
        >
          <Content style={{ marginTop: 0 }}>
            <Radio.Group
              style={{ marginTop: 3 }}
              onChange={onChange}
              defaultValue="a"
            >
              <Radio
                style={{
                  background: "white",
                }}
                value="a"
              >
                MECANICA
              </Radio>
              <Radio
                style={{
                  background: "white",
                }}
                value="b"
              >
                LATONERIA
              </Radio>
            </Radio.Group>
            <Row style={{ marginTop: 0 }}>
              <Col span={4}>
                <Typography.Title level={4} rong>
                  TÉCNICO
                </Typography.Title>
              </Col>
              {horas.map((hora) => (
                <Col span={2} style={{ textAlign: "center" }}>
                  <Typography.Title level={4}>{hora}:00</Typography.Title>
                </Col>
              ))}
            </Row>

            {/* Filas por cada técnico */}
            {tecnicosAMostrar.map((tecnico) => (
              <>
                <Row gutter={[2, 4]}>
                  <Col
                    span={3}
                    style={{
                      alignContent: "center",
                    }}
                  >
                    <Typography.Text strong>{tecnico.name}</Typography.Text>
                  </Col>
                  <Col
                    span={1}
                    style={{
                      alignContent: "center",
                    }}
                  >
                    <Typography.Text strong>ACTUAL</Typography.Text>
                  </Col>
                  {horas.map((hora) => (
                    <FilaTablero
                      hora={hora}
                      tecnico={tecnico}
                      tipo="ACTUAL"
                    ></FilaTablero>
                  ))}
                  <Col span={3}>
                    <Typography.Text strong></Typography.Text>
                  </Col>
                  <Col
                    span={1}
                    style={{
                      alignContent: "center",
                    }}
                  >
                    <Typography.Text strong>PLAN</Typography.Text>
                  </Col>
                  {horas.map((hora) => (
                    <FilaTablero
                      hora={hora}
                      tecnico={tecnico}
                      tipo="PLAN"
                    ></FilaTablero>
                  ))}
                  <Divider
                    style={{
                      borderColor: "#7cb305",
                      padding: 0,
                      margin: 6,
                    }}
                  ></Divider>
                </Row>
              </>
            ))}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default App;
