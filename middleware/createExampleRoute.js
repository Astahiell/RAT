const createExampleRoute = (routeName, imageLink, fileuuid) => {
  const route = {
    uuid: fileuuid,
    name: routeName,
    description: "Your Amazing Description",
    category: null,
    condition: "Private",
    map: imageLink,
    starting_pin: "AA1111",
  };
  return JSON.stringify(route, null, 2);
};

module.exports = createExampleRoute;
