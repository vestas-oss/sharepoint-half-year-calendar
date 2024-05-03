let start = Promise.resolve();

if (typeof window !== "undefined") {
    const { worker } = require("./browser");
    start = worker.start(); 
}

export { start };