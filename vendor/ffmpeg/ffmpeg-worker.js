var now = Date.now;

importScripts('ffmpeg-all-codecs.js');

function print(text) {
    postMessage({
        "type": "stdout",
        "data": text
    });
};

onmessage = function(event) {
    var message = event.data;
    var Module, time, result, totalTime, ffmpeg;

    if (message.type === "command") {

        var Module = {
            print: print,
            printErr: print,
            files: message.files || [],
            arguments: message.arguments || [],
            TOTAL_MEMORY: 268435456
        };

        postMessage({
            type: "start",
            data: Module.arguments.join(" ")
        });

        postMessage({
            type: "stdout",
            data: "Received command: " + Module.arguments.join(" ") + ((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")
        });

        time = now();
        try {
            result = ffmpeg_run(Module);            
        }
        catch(exc) {
            totalTime = now() - time;
            postMessage({
                type: "fail",
                id: message.id,
                data: "Failure on ffmpeg_run",
                time: totalTime,
                errname: exc.name,
                errmessage: exc.message
            });

            return;
        }

        totalTime = now() - time;

        postMessage({
            type: "stdout",
            data: "Finished processing (took " + totalTime + "ms)"
        });

        postMessage({
            type: "done",
            id: message.id,
            data: result,
            time: totalTime
        });
    }
};
postMessage({
    "type": "ready"
});