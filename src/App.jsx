import React, { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  theme,
  Divider,
  Radio,
  Image,
} from "antd";
import logo from "./assets/Logo Toyocuenca 2021-01.png";
import { FilaTablero } from "./Fila";
import "./assets/styles.css";
import axios from "axios";

const apiUrl = import.meta.env.VITE_URL_API;
const { Header, Content } = Layout;

const App = () => {
  const [clave, setClave] = useState("a");
  const [tecnicos, setTecnicos] = useState([]);
  const [visibleGroup, setVisibleGroup] = useState(0);
  const [totalGrupos, setTotalGrupos] = useState(0);
  const [tecnicosAMostrar, setTecnicosAMostrar] = useState([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const horas = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18];
  const tecnicosPorGrupo = 4;

  // Obtener los técnicos desde la API
  const obtenerTecnicos = async () => {
    try {
      const body = {
        agencia: "08",
        tipo: clave === "a" ? "MEC" : "LAT",
        dia: "2",
      };

      const res = await axios.post(apiUrl, body, {
        headers: {
          Authorization:
            "dfa5b24e-a654-4f4c-b3f3-edd8e4a444d8!1efd02f3af567a7aa6dba7b8a773cebbde07f0f9ccf7f0d0ebd8647eefeddb67980bc780a37484",
          "Content-Type": "application/json",
        },
      });
      if (res.data.estado === 1) {
        const tecnicosMap = {};
        res.data.ordenes.forEach((tecnico) => {
          if (!tecnicosMap[tecnico.TecnicoNombre]) {
            tecnicosMap[tecnico.TecnicoNombre] = {
              name: tecnico.TecnicoNombre,
              ordenes: [],
            };
          }
          tecnicosMap[tecnico.TecnicoNombre].ordenes.push({
            orden:
              clave === "a"
                ? `MEC-${tecnico.OrdenNumero.trim()}`
                : `LAT-${tecnico.OrdenNumero.trim()}`,
            tipo:
              tecnico.OrdenEstado === "400" || tecnico.OrdenEstado === "401"
                ? "ACTUAL"
                : "PLAN",
            hora: tecnico.OrdenHora,
          });
        });

        const tecnicosList = Object.values(tecnicosMap);
        setTecnicos(tecnicosList); // Guardar todos los técnicos
        setTotalGrupos(Math.ceil(tecnicosList.length / tecnicosPorGrupo)); // Calcular el total de grupos
      } else {
        setTecnicos([]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Obtener técnicos cuando cambie la clave
  useEffect(() => {
    obtenerTecnicos();
    const intervalo = setInterval(obtenerTecnicos, 300000);
    return () => clearInterval(intervalo);
  }, [clave]);

  // Calcular técnicos a mostrar según el grupo visible
  useEffect(() => {
    const start = visibleGroup * tecnicosPorGrupo;
    const end = start + tecnicosPorGrupo;
    setTecnicosAMostrar(tecnicos.slice(start, end));
  }, [visibleGroup, tecnicos]);

  // Ciclo automático entre grupos
  useEffect(() => {
    if (totalGrupos > 1) {
      const interval = setInterval(() => {
        setVisibleGroup((prevGroup) => (prevGroup + 1) % totalGrupos);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [totalGrupos]);

  const onChange = (e) => {
    setClave(e.target.value);
    setVisibleGroup(0); // Resetear al primer grupo al cambiar de clave
  };

  return (
    <Layout style={{ maxHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#d9d9d9",
          height: "50px",
        }}
      >
        <Image src={logo} width="220px" alt="Logo" height="220px" />
      </Header>

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
              <Radio style={{ background: "white" }} value="a">
                MECANICA
              </Radio>
              <Radio style={{ background: "white" }} value="b">
                LATONERIA
              </Radio>
            </Radio.Group>

            <Row style={{ marginTop: 0 }}>
              <Col span={4}>
                <Typography.Title level={4}>TÉCNICO</Typography.Title>
              </Col>
              {horas.map((hora) => (
                <Col key={hora} span={2} style={{ textAlign: "center" }}>
                  <Typography.Title level={3}>{hora}:00</Typography.Title>
                </Col>
              ))}
            </Row>

            {tecnicosAMostrar.map((tecnico, index) => (
              <React.Fragment key={index}>
                <Row gutter={[2, 4]}>
                  <Col span={3}>
                    <Typography.Text strong style={{ fontSize: "18px" }}>
                      {tecnico.name}
                    </Typography.Text>
                  </Col>
                  <Col span={1}>
                    <Typography.Text strong style={{ fontSize: "18px" }}>
                      ACTUAL
                    </Typography.Text>
                  </Col>
                  {horas.map((hora) => (
                    <FilaTablero
                      key={`${tecnico.name}-ACTUAL-${hora}`}
                      hora={hora}
                      tecnico={tecnico}
                      tipo="ACTUAL"
                    />
                  ))}
                  <Col span={3}>
                    <Typography.Text strong></Typography.Text>
                  </Col>
                  <Col span={1}>
                    <Typography.Text strong style={{ fontSize: "18px" }}>
                      PLAN
                    </Typography.Text>
                  </Col>
                  {horas.map((hora) => (
                    <FilaTablero
                      key={`${tecnico.name}-PLAN-${hora}`}
                      hora={hora}
                      tecnico={tecnico}
                      tipo="PLAN"
                    />
                  ))}
                  <Divider
                    style={{ borderColor: "#7cb305", padding: 0, margin: 6 }}
                  />
                </Row>
              </React.Fragment>
            ))}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default App;
