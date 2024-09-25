import { Col, Row, Typography } from "antd";

export const FilaTablero = ({ hora, tecnico, tipo }) => {
  //console.log(tecnico.ordenes);
  const ordenesHora = tecnico.ordenes.filter((orden) => orden.hora === hora);
  //console.log(ordenesHora);
  const obtenerOrdenPorTecnicoYHora = (orden) => {
    if (orden.hora === hora && orden.tipo === tipo) {
      return orden.orden;
    }
    return null;
  };
  return (
    <Col key={hora} span={2}>
      <div
        style={{
          height: "100px",
          backgroundColor: "#d9d9d9",
          display: "flex",

          flexDirection: "column",
          justifyContent: "center",
          borderRadius: "5px",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <Row
            key={index}
            gutter={[1]}
            style={{
              marginBottom: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {ordenesHora.slice(index, index + 1).map((orden) => (
              <Col span={22} key={orden.id}>
                <div
                  style={{
                    height: "25px",
                    backgroundColor:
                      tipo === "PLAN" && obtenerOrdenPorTecnicoYHora(orden)
                        ? "#23BAC4"
                        : tipo === "ACTUAL" &&
                          obtenerOrdenPorTecnicoYHora(orden)
                        ? "#bae637"
                        : "#d9d9d9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "3px",
                    border: obtenerOrdenPorTecnicoYHora(orden)
                      ? "2px solid black"
                      : "0px solid black",
                  }}
                >
                  <Typography.Text strong style={{ fontSize: "18px" }}>
                    {obtenerOrdenPorTecnicoYHora(orden)}
                  </Typography.Text>
                </div>
              </Col>
            ))}
          </Row>
        ))}
      </div>
    </Col>
  );
};
