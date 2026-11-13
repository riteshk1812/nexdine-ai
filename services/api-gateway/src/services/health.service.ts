export const getHealthStatus = () => {
  return {
    status: "UP",
    service: "api-gateway",
    timeStamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  };
};
