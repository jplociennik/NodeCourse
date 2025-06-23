const args = process.argv.slice(2);

// Parsowanie argumentów
const parsed = {};
args.forEach(arg => {
  const [key, value] = arg.includes('=') ? arg.split('=') : ['command', arg];
  parsed[key] = value;
});

// const nameProductVal = parsed.name
// const sizeVal = parsed.size

// console.log(process.argv)

// console.log(`Przygotowuję ${nameProductVal} o pojemności ${sizeVal}ml`)

if (parsed.command && parsed.methods) {
  const className = parsed.command;
  const methods = parsed.methods.split(',');

  // Generowanie kodu klasy
  let output = `class ${className} {\n`;

  methods.forEach(method => {
    output += `  ${method}(${className.toLowerCase()}) {}\n`;
  });

  output += `}\n`;

  console.log(output);
} else {
  console.log('Użycie:\nnode code-generator.js make:class ClassName methods="method1,method2"');
}
