const createExampleGroup = () => {
  const example = {
    groups: [
      {
        name: "Your First Group",
      },
    ],
  };
  return JSON.stringify(example, null, 2);
};

module.exports = createExampleGroup;