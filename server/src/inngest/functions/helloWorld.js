import { inngest } from "../index.js"

// Your new function:
export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        console.log(`Hello ${event.data.email}!`);
        
        return { message: `Hello ${event.data.email}!` };
    },
);