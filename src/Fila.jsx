import { Col, Row, Typography } from "antd";

export const FilaTablero = ({ hora, tecnico, tipo }) => {
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
        {[0, 1, 2].map((index) => (
          <Row
            key={index}
            gutter={[5]}
            style={{
              marginBottom: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {tecnico.ordenes.slice(index * 2, (index + 1) * 2).map((orden) => (
              <Col span={10} key={orden.id}>
                <div
                  style={{
                    height: "30px",
                    backgroundColor: obtenerOrdenPorTecnicoYHora(orden)
                      ? "#bae637"
                      : "#d9d9d9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "3px",
                    border: obtenerOrdenPorTecnicoYHora(orden)
                      ? "1px solid black"
                      : "0px solid black",
                  }}
                >
                  <Typography.Text strong>
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
