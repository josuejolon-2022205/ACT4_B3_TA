import { createInterface } from "readline/promises";

export const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});