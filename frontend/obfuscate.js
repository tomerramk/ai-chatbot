import obfuscator from "javascript-obfuscator";
import fs from "fs";
import path from "path";

const dir = "./dist/assets";

fs.readdirSync(dir).forEach((file) => {
  if (file.endsWith(".js")) {
    const filePath = path.join(dir, file);
    const code = fs.readFileSync(filePath, "utf8");

    const obfuscatedCode = obfuscator
      .obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: false,
        stringArray: true,
        stringArrayEncoding: ["rc4", "base64"],
        stringArrayThreshold: 0.75,
        splitStrings: true,
        splitStringsChunkLength: 5,
        simplify: true,
        debugProtection: true,
        debugProtectionInterval: 4000,
        disableConsoleOutput: true,
        selfDefending: true,
        renameGlobals: true,
        numbersToExpressions: true,
        ignoreRequireImports: true,
      })
      .getObfuscatedCode();

    fs.writeFileSync(filePath, obfuscatedCode, "utf8");
    console.log(`Obfuscated: ${file}`);
  }
});
