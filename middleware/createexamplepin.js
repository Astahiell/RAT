const createExamplePin = () => {
  const example = {
    pins: [
      {
        id: "AA1111",
        name: "Your Pin",
        groups: "Your First Group",
        description: "Your Amazing Pin",
        image: "https://imgur.com/testowy",
        connected: [{ id: "AA1111", name: "Your Pin" }],
        lat: 0,
        lng: 0,
        icon: "red",
      },
    ],
  };
  return JSON.stringify(example, null, 2);
};

module.exports = createExamplePin;
 