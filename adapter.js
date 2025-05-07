class Message {
    constructor(audio, text, startTime, endTime) {
        this.audio = audio;
        this.text = text;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

async function Adapter() {

    // Custom sleep function using Promise
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Wait for the avatar to be loaded
    while (window.avatar === undefined) {
        await sleep(100); // Sleep for 100ms before checking again
    }
    console.log("adapter: avatar loaded");

    const delayLimit = 3000;
    const restEndpoint = "http://localhost/api/v1/request";
    const sttEndpoint = "http://localhost/api/v1/stt";

    while (true) {
        try {

            var input

            console.log("Listening...");

            while (true) {
                input = window.avatar.listen();

                if (input !== '') {
                    console.log("Condition met! Proceeding with next step.");
                    break;  // Exit the loop and proceed with the next step
                }

                await sleep(100);  // Sleep for 100 milliseconds (0.1s)
            }

            console.log("Received input:", input);

            // // optional transcription step
            // if (input.audio != null) {
            //
            //     console.log("Transcribing...");
            //     const sttResponse = fetch(sttEndpoint, {
            //         method: 'POST',
            //         headers: {'Content-Type': 'application/json'},
            //         body: JSON.stringify({audioData: input})
            //     }).then(response => response.json());
            //
            //     const transcription = sttResponse.message;
            //     window.avatar.transcribed(transcription);
            // }

            // Send the input to the agent backend

            // console.log("sending data to the agent backend...");
            // const restPromise = new Promise((resolve, reject) => {
            //     const timeoutId = setTimeout(() => {
            //         reject(new Error('REST call timed out'));
            //     }, delayLimit);
            //
            //     fetch(restEndpoint, {
            //         method: 'POST',
            //         headers: {'Content-Type': 'application/json'},
            //         body: JSON.stringify({input})
            //     })
            //         .then(response => response.json())
            //         .then(data => {
            //             clearTimeout(timeoutId);
            //             resolve(data);
            //         })
            //         .catch(err => reject(err));
            // });
            //
            // const response = await restPromise;

            // window.avatar.talk(response.message);

            // inspect(input);

            let response = JSON.parse(input);

            response.text = "...1";
            console.log("telling the avatar to talk: ", response.text);
            window.avatar.talk(JSON.stringify(response), "False");

            await sleep(1000); // Sleep for 100ms before checking again
            await sleep(window.avatar.timeToWait);

            response.text = "...2";
            console.log("telling the avatar to talk: ", response.text);
            window.avatar.talk(JSON.stringify(response), "False");

            await sleep(1000); // Sleep for 100ms before checking again
            await sleep(window.avatar.timeToWait);
            response.text = "...3";
            console.log("telling the avatar to talk: ", response.text);
            window.avatar.talk(JSON.stringify(response), "False");

            await sleep(1000); // Sleep for 100ms before checking again
            await sleep(window.avatar.timeToWait);
            
            response.text = "...final";
            console.log("telling the avatar to talk: ", response.text);
            window.avatar.talk(JSON.stringify(response), "True");

        } catch (error) {
            if (error.message === 'REST call timed out') {
                window.avatar.talk("Sorry for the delay, processing your input now.");
                const response = await fetch(restEndpoint, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({input})
                }).then(res => res.json());

                window.avatar.talk(response.message);
            } else {
                console.error("An error occurred:", error);
            }
        }
    }
}

Adapter();

// var x = new Message(null, null, 0.0, 0.0);

function logObjectTypes(obj, level = 0, visited = new Set(), maxDepth = 10) {
    const indent = ' '.repeat(level * 2);

    // Stop if we exceed maxDepth
    if (level > maxDepth) {
        console.log(`${indent}Max depth reached at level ${level}`);
        return;
    }

    // Check if we have visited this object before (to prevent circular references)
    if (visited.has(obj)) {
        console.log(`${indent}Circular reference detected at level ${level}`);
        return;
    }

    // Mark the current object as visited
    visited.add(obj);

    // Log the object keys and their types
    for (let key of Object.keys(obj)) {
        let value = obj[key];
        console.log(`${indent}[Level ${level}] Key: ${key}, Type: ${typeof value}`);

        // If the value is an object, recursively log its properties
        if (typeof value === 'object' && value !== null) {
            logObjectTypes(value, level + 1, visited, maxDepth);
        }
    }
}

function inspectAllProperties(obj) {
    let current = obj;
    while (current !== null) {
        console.log("Object:", current);
        console.log("Own Property Names:", Object.getOwnPropertyNames(current));
        current = Object.getPrototypeOf(current);  // Walk up the prototype chain
    }
}

function inspect(input) {
    console.log("console.dir:")
    console.dir(input, { depth: null });

    console.log("stringify:", JSON.stringify(input, null, 2));

    console.log("logObjectTypes:")
    logObjectTypes(input);

    console.log("inspectAllProperties:");
    inspectAllProperties(input);

    console.log("reflect.ownkeys:");
    console.log(Reflect.ownKeys(input));
}
