const start = performance.now();
for (let i=0; i<1000000; i++) {
    const arr = new Uint8Array(365);
}
console.log("Time: " + (performance.now() - start));
