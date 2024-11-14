(async () => {
  const { parse, random } = await import("merunyaa.xyz");

  parse("9259").then((images) => {
    console.log(images.join(",\n"));
  });

  random().then((images) => {
    console.log(images.join(",\n"));
  });
})();
