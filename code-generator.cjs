const fs = require("fs");
const { exec } = require("child_process");

// Check if the api.ts file exists, delete it
if (fs.existsSync("./api.ts")) {
    fs.unlinkSync("./api.ts");
}

// Check if the .env.local file exists
if (!fs.existsSync(".env.local")) {
    console.error(
        "The .env.local file does not exist. Please create it and add the VITE_API_URL environment variable.",
    );
    return;
}

// Read the contents of the .env.local file
const envLocal = fs.readFileSync(".env.local", "utf8");

// Parse the contents of the .env.local file into an object
const envLocalObj = envLocal.split("\n").reduce((acc, curr) => {
    const [key, value] = curr.split("=");
    if (key && value) {
        acc[key.trim()] = value.trim();
    }
    return acc;
}, {});

const config = {
    template: "Axios",
    dateTimeType: "DayJS",
    operationGenerationMode: "MultipleClientsFromFirstTagAndOperationId",
    generateOptionalParameters: "true",
    generateClientClasses: "true",
    clientBaseClass: "",
    typeStyle: "Interface",
    enumStyle: "StringLiteral",
};

// check if the VITE_API_URL environment variable is URL

let apiEndpoint = new URL(envLocalObj.VITE_API_URL.replace(/"/g, ""));

console.log(`Generating API client for ${apiEndpoint.hostname}`);

const nswagCommand = Array.from(Object.entries(config)).reduce(
    (acc, curr) => {
        const [key, value] = curr;
        acc += `/${key}:${value} `;
        return acc;
    },
    `.\\node_modules\\.bin\\nswag openapi2tsclient /input:${apiEndpoint.protocol
    }//${apiEndpoint.hostname}${apiEndpoint.port ? ":" + apiEndpoint.port : ""
    }/swagger/v1/swagger.json ` + `/output:./api.ts `,
);

exec(nswagCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`NSwag NPM CLI error: ${error}`);
        return;
    }
    console.log(`NSwag NPM CLI stdout: ${stdout}`);
    console.error(`NSwag NPM CLI stderr: ${stderr}`);
}).on("close", (code) => {
    // replace /api/ with / in api.ts
    // replace result200 = JSON.parse(resultData200) with result200 = resultData200
    fs.readFile("./api.ts", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const result = data
            .replace(/\/api\//g, "/")
            .replace(
                /result200 = JSON.parse\(resultData200\)/g,
                "result200 = resultData200",
            );

        fs.writeFile("./api.ts", result, "utf8", (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    });
});
