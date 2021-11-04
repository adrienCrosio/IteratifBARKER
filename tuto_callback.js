


function my_callback_function1(message, message2) {
    let json = {};
    json[message] = message2;
    console.log(json);
}

function my_callback_function2(message) {
    console.log("22222");
    console.log(message);
}

function my_callback_launcher(json_callback) {
    for (const key in json_callback) {
        console.log(`I detected key : ${key} => ${json_callback[key]}`);
        if (key === "open") {
            json_callback[key]("mes couille ouvre toi");
        }
        else if (key === "close") {
            json_callback[key]("mes couille ferme toi");

        }
        else if (key === "message") {
            json_callback[key]("mes couille message toi");
        }
        else {
            console.log("vas bien niquer ta mere");
        }
    }
}

let callback_json = {
    open: my_callback_function1,
    close: my_callback_function1,
    message: my_callback_function2
}

// first complicated exemple
// my_callback_launcher(callback_json);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function my_callback_launcher_event(callback) {
    while (true) {
        //simulate event that is comming every second
        await sleep(1000);
        callback("my data", "my data 2");
    }
}

async function test(){
    while (true) {
        await sleep(500);
        console.log(88416);
    }
}
test();
my_callback_launcher_event(my_callback_function1);
